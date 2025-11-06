import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "../../../../lib/email";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, fullName, phone } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
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

    // 🔹 Create user (inactive until verified)
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        isActive: 0, // Int (0 = inactive)
        emailVerified: 0, // Int (0 = not verified)
        createdAt: currentTime,
        updatedAt: currentTime,
        profile: {
          create: {
            fullName: fullName || undefined,
            phone: phone || undefined,
          },
        },
        verificationTokens: {
          create: {
            token,
            expiresAt, // DateTime type, valid for SQLite/D1
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // 🔹 Send verification email
    const emailResult = await sendVerificationEmail(user.email, token);

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      // Optionally rollback or alert admin
    }

    // 🔹 Remove sensitive fields before returning
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message:
          "User created successfully. Please check your email to verify your account.",
        user: userWithoutPassword,
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
