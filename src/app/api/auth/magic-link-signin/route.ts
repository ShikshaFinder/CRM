import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, userId } = body;

    if (!token || !userId) {
      return NextResponse.json(
        { error: "Token and userId are required" },
        { status: 400 }
      );
    }

    // Verify the magic link token one more time
    const magicLinkToken = await prisma.magicLinkToken.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });

    if (
      !magicLinkToken ||
      magicLinkToken.userId !== userId ||
      new Date() > magicLinkToken.expiresAt
    ) {
      return NextResponse.json(
        { error: "Invalid or expired magic link token" },
        { status: 400 }
      );
    }

    // Check if user is verified and active
    if (
      !magicLinkToken.user.emailVerified ||
      !magicLinkToken.user.isActive
    ) {
      return NextResponse.json(
        { error: "Account is not verified or active" },
        { status: 400 }
      );
    }

    // Return success - the client will use this token with NextAuth's signIn
    return NextResponse.json({
      success: true,
      token: token, // Return token for client to use with signIn
    });
  } catch (error: any) {
    console.error("Magic link signin error:", error);
    return NextResponse.json(
      { error: "Failed to process magic link signin" },
      { status: 500 }
    );
  }
}

