import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/magic-login?error=MissingToken", req.url)
      );
    }

    // Find magic link token
    const magicLinkToken = await prisma.magicLinkToken.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            profile: true,
            roles: {
              include: {
                role: true,
              },
            },
            department: true,
            memberships: true,
          },
        },
      },
    });

    if (!magicLinkToken) {
      return NextResponse.redirect(
        new URL("/magic-login?error=InvalidToken", req.url)
      );
    }

    // Check if token is expired
    if (new Date() > magicLinkToken.expiresAt) {
      // Delete expired token
      await prisma.magicLinkToken.delete({
        where: { token },
      });
      return NextResponse.redirect(
        new URL("/magic-login?error=ExpiredToken", req.url)
      );
    }

    // Check if user is verified and active
    if (!magicLinkToken.user.emailVerified || !magicLinkToken.user.isActive) {
      await prisma.magicLinkToken.delete({
        where: { token },
      });
      return NextResponse.redirect(
        new URL("/magic-login?error=AccountNotVerified", req.url)
      );
    }

    // Update last login
    await prisma.user.update({
      where: { id: magicLinkToken.user.id },
      data: { lastLoginAt: Math.floor(Date.now() / 1000) },
    });

    // Delete used token
    await prisma.magicLinkToken.delete({
      where: { token },
    });

    // Redirect to a client-side page that will handle the sign-in
    const redirectUrl = new URL("/magic-login", req.url);
    redirectUrl.searchParams.set("token", token);
    redirectUrl.searchParams.set("userId", magicLinkToken.user.id);

    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error("Magic link login error:", error);
    return NextResponse.redirect(
      new URL("/magic-login?error=LoginFailed", req.url)
    );
  }
}

