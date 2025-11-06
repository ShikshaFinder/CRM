import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date() > verificationToken.expiresAt) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      });
      return NextResponse.json(
        { error: 'Verification token has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify user email and activate account
    const user = await prisma.user.update({
      where: { id: verificationToken.userId },
      data: {
        emailVerified: true,
        isActive: true,
      },
    });

    // Delete used verification token
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json(
      {
        message: 'Email verified successfully. Your account has been activated.',
        verified: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email. Please try again.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date() > verificationToken.expiresAt) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      });
      return NextResponse.json(
        { error: 'Verification token has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify user email and activate account
    const user = await prisma.user.update({
      where: { id: verificationToken.userId },
      data: {
        emailVerified: true,
        isActive: true,
      },
    });

    // Delete used verification token
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json(
      {
        message: 'Email verified successfully. Your account has been activated.',
        verified: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email. Please try again.' },
      { status: 500 }
    );
  }
}


