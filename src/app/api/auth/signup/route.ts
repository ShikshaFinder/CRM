import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "../../../../lib/email";
import { randomBytes } from "crypto";
import { checkRateLimit } from "../../../../lib/rate-limit";

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

async function generateUniqueOrgCode(): Promise<string> {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars (0, O, I, 1)
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    // Generate 6-character code
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const existing = await prisma.organization.findUnique({
      where: { code },
      select: { id: true },
    });

    if (!existing) {
      return code;
    }

    attempts++;
  }

  // Fallback: use timestamp-based code if we can't find unique one
  return `ORG${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      email, 
      password, 
      fullName, 
      phone, 
      organizationName,
      signupType = 'create',
      inviteCode,
      organizationCode,
    } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Validate based on signup type
    if (signupType === 'create' && !organizationName) {
      return NextResponse.json(
        { error: "Organization name is required when creating a new organization" },
        { status: 400 }
      );
    }

    if (signupType === 'join') {
      if (!inviteCode) {
        return NextResponse.json(
          { error: "Invite code is required when joining an organization" },
          { status: 400 }
        );
      }
      if (!organizationCode) {
        return NextResponse.json(
          { error: "Organization code is required when joining an organization" },
          { status: 400 }
        );
      }
    }

    // Rate limiting: 3 signups per hour per IP
    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimitResult = checkRateLimit(`signup:${clientIp}`, {
      maxRequests: 3,
      windowMs: 60 * 60 * 1000, // 1 hour
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many signup attempts. Please try again later.",
        },
        { status: 429 }
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

    // 🔹 Generate email verification token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // expires in 24 hours

    const currentTime = Math.floor(Date.now() / 1000); // Unix seconds

    let result: any;
    let organization: any = null;

    if (signupType === 'join') {
      // 🔹 Validate invite and organization code
      const invite = await prisma.organizationInvite.findUnique({
        where: { token: inviteCode },
        include: {
          organization: true,
        },
      });

      if (!invite) {
        return NextResponse.json(
          { error: "Invalid invite code" },
          { status: 400 }
        );
      }

      // Check if invite is still pending
      if (invite.status !== "PENDING") {
        return NextResponse.json(
          { error: "This invitation is no longer valid" },
          { status: 400 }
        );
      }

      // Check if invite is expired
      if (new Date() > invite.expiresAt) {
        return NextResponse.json(
          { error: "This invitation has expired" },
          { status: 400 }
        );
      }

      // Verify organization code matches
      if (invite.organization.code.toUpperCase() !== organizationCode.toUpperCase()) {
        return NextResponse.json(
          { error: "Organization code does not match the invite" },
          { status: 400 }
        );
      }

      // Verify email matches invite email
      if (invite.email.toLowerCase() !== normalizedEmail) {
        return NextResponse.json(
          { error: "This invitation was sent to a different email address" },
          { status: 400 }
        );
      }

      organization = invite.organization;

      // 🔹 Create user without organization (will join after verification)
      // Note: D1 doesn't support interactive transactions, so we use sequential operations
      const user = await prisma.user.create({
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

      await prisma.verificationToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt,
        },
      });

      result = { user, inviteId: invite.id, organizationId: invite.organizationId };
    } else {
      // 🔹 Create flow: Create user + organization
      // Note: D1 doesn't support interactive transactions, so we use sequential operations
      const orgSlug = await generateUniqueSlug(organizationName);
      const orgCode = await generateUniqueOrgCode();

      const user = await prisma.user.create({
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

      const newOrganization = await prisma.organization.create({
        data: {
          name: organizationName.trim(),
          slug: orgSlug,
          code: orgCode,
          ownerId: user.id,
          createdAt: currentTime,
          updatedAt: currentTime,
        },
      });

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          defaultOrganizationId: newOrganization.id,
        },
        include: {
          profile: true,
        },
      });

      await prisma.organizationMembership.create({
        data: {
          userId: user.id,
          organizationId: newOrganization.id,
          role: ORG_ROLE_ADMIN,
        },
      });

      await prisma.verificationToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt,
        },
      });

      result = { user: updatedUser, organization: newOrganization };

      organization = result.organization;
    }

    // 🔹 Send verification email
    const emailResult = await sendVerificationEmail(result.user.email, token);

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      // Log but don't fail the signup - user can request resend
    } else {
      if (signupType === 'create') {
        console.log(`Verification email sent to ${result.user.email} for organization ${organization.name}`);
      } else {
        console.log(`Verification email sent to ${result.user.email} to join organization ${organization.name}`);
      }
    }

    // 🔹 Remove sensitive fields before returning
    const { password: _, ...userWithoutPassword } = result.user;

    return NextResponse.json(
      {
        message:
          signupType === 'create'
            ? "User created successfully. Please check your email to verify your account."
            : "Account created successfully. Please check your email to verify and join the organization.",
        user: {
          ...userWithoutPassword,
          organization: organization,
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
