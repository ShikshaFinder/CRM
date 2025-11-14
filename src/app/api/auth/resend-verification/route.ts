import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";
import { sendVerificationEmail } from "../../../../lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email?.toLowerCase()?.trim();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always respond success message to avoid email enumeration
    if (!user) {
      return NextResponse.json({
        message: "If an account exists for this email, a new verification link has been sent.",
      });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        message: "This account is already verified. You can sign in now.",
      });
    }

    await prisma.verificationToken.deleteMany({ where: { userId: user.id } });

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    await sendVerificationEmail(user.email, token);

    return NextResponse.json({
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification email." },
      { status: 500 }
    );
  }
}
