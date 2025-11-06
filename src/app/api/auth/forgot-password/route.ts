import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { sendPasswordResetEmail } from '../../../../lib/email';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists with this email, a password reset link has been sent.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    // Create or update verification token for password reset
    await prisma.verificationToken.upsert({
      where: { token: token },
      update: {
        expiresAt,
      },
      create: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(user.email, token);

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error);
      // Still return success to user (don't reveal email issues)
    }

    return NextResponse.json(
      { message: 'If an account exists with this email, a password reset link has been sent.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request. Please try again.' },
      { status: 500 }
    );
  }
}

