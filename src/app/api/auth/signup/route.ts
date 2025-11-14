import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "../../../../lib/email";
import { randomBytes } from "crypto";

const ORG_ROLE_ADMIN = "ADMIN";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60) || `org-${randomBytes(4).toString("hex")}`;
}

async function generateUniqueSlug(name: string) {
  const baseSlug = slugify(name);
  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.organization.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${baseSlug}-${counter++}`;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, fullName, phone, organizationName } = body;

    if (!email || !password || !organizationName) {
      return NextResponse.json(
        { error: "Email, password, and organization name are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // 🔹 Normalize email
    const normalizedEmail = email.toLowerCase();

    // 🔹 Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // 🔹 Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Prepare organization slug
    const orgSlug = await generateUniqueSlug(organizationName);

    // 🔹 Generate email verification token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // expires in 24 hours

    const currentTime = Math.floor(Date.now() / 1000); // Unix seconds

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          password: hashedPassword,
          isActive: 0,
          emailVerified: 0,
          createdAt: currentTime,
          updatedAt: currentTime,
          profile: {
            create: {
              fullName: fullName || undefined,
              phone: phone || undefined,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      const organization = await tx.organization.create({
        data: {
          name: organizationName.trim(),
          slug: orgSlug,
          ownerId: user.id,
          createdAt: currentTime,
          updatedAt: currentTime,
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          defaultOrganizationId: organization.id,
        },
        include: {
          profile: true,
        },
      });

      await tx.organizationMembership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: ORG_ROLE_ADMIN,
        },
      });

      await tx.verificationToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt,
        },
      });

      return { user: updatedUser, organization };
    });

    // 🔹 Send verification email
    const emailResult = await sendVerificationEmail(result.user.email, token);

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      // Optionally rollback or alert admin
    }

    // 🔹 Remove sensitive fields before returning
    const { password: _, ...userWithoutPassword } = result.user;

    return NextResponse.json(
      {
        message:
          "User created successfully. Please check your email to verify your account.",
        user: {
          ...userWithoutPassword,
          organization: result.organization,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create user. Please try again." },
      { status: 500 }
    );
  }
}
