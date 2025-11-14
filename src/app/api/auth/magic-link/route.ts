import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { sendMagicLinkEmail } from "../../../../lib/email";
import { randomBytes } from "crypto";
import { checkRateLimit } from "../../../../lib/rate-limit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;
    
    // Rate limiting: 5 requests per 15 minutes per email
    const rateLimitResult = checkRateLimit(`magic-link:${email}`, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          message:
            "Too many requests. Please wait before requesting another magic link.",
        },
        { status: 429 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });

    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, a magic link has been sent.",
        },
        { status: 200 }
      );
    }

    // Check if email is verified - magic links only work for verified users
    if (!user.emailVerified) {
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, a magic link has been sent.",
        },
        { status: 200 }
      );
    }

    // Generate magic link token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes expiry

    // Delete any existing magic link tokens for this user
    await prisma.magicLinkToken.deleteMany({
      where: { userId: user.id },
    });

    // Create new magic link token
    await prisma.magicLinkToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // Send magic link email
    const emailResult = await sendMagicLinkEmail(user.email, token);

    if (!emailResult.success) {
      console.error("Failed to send magic link email:", emailResult.error);
      // Still return success to user (don't reveal email issues)
    } else {
      console.log(`Magic link sent to ${user.email}`);
    }

    return NextResponse.json(
      {
        message:
          "If an account exists with this email, a magic link has been sent.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Magic link request error:", error);
    return NextResponse.json(
      { error: "Failed to process magic link request. Please try again." },
      { status: 500 }
    );
  }
}

