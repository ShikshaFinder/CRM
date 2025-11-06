import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '../../../../lib/prisma';
import { sendVerificationEmail } from '../../../../lib/email';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, fullName, phone } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

    // Create user (inactive until email is verified)
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        isActive: false,
        emailVerified: false,
        profile: {
          create: {
            fullName: fullName || undefined,
            phone: phone || undefined,
          },
        },
        verificationTokens: {
          create: {
            token,
            expiresAt,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(user.email, token);

    if (!emailResult.success) {
      // If email fails, we still create the user but log the error
      console.error('Failed to send verification email:', emailResult.error);
      // Optionally, you might want to delete the user here if email is critical
    }

    // Don't return the password or token in response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: 'User created successfully. Please check your email to verify your account.',
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user. Please try again.' },
      { status: 500 }
    );
  }
}


