import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
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
        { error: "Invalid or expired verification token" },
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
        { error: "Verification token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Check for pending invite for this user's email
    const pendingInvite = await prisma.organizationInvite.findFirst({
      where: {
        email: verificationToken.user.email.toLowerCase(),
        status: "PENDING",
      },
      include: {
        organization: true,
      },
    });

    // Verify user email and activate account, and handle organization join
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: verificationToken.userId },
        data: {
          emailVerified: 1,
          isActive: 1,
        },
      });

      let joinedOrganization = null;

      // If there's a pending invite, join the organization
      if (pendingInvite && new Date() <= pendingInvite.expiresAt) {
        // Check if user is already a member
        const existingMembership = await tx.organizationMembership.findUnique({
          where: {
            userId_organizationId: {
              userId: user.id,
              organizationId: pendingInvite.organizationId,
            },
          },
        });

        if (!existingMembership) {
          // Create membership
          await tx.organizationMembership.create({
            data: {
              userId: user.id,
              organizationId: pendingInvite.organizationId,
              role: pendingInvite.role,
            },
          });

          // Set as default organization if user doesn't have one
          if (!user.defaultOrganizationId) {
            await tx.user.update({
              where: { id: user.id },
              data: {
                defaultOrganizationId: pendingInvite.organizationId,
              },
            });
          }

          // Mark invite as accepted
          await tx.organizationInvite.update({
            where: { id: pendingInvite.id },
            data: {
              status: "ACCEPTED",
              updatedAt: Math.floor(Date.now() / 1000),
            },
          });

          joinedOrganization = pendingInvite.organization;
        }
      }

      // Delete used verification token
      await tx.verificationToken.delete({
        where: { token },
      });

      return { user, joinedOrganization };
    });

    const message = result.joinedOrganization
      ? `Email verified successfully. You have been added to ${result.joinedOrganization.name}.`
      : "Email verified successfully. Your account has been activated.";

    return NextResponse.json(
      {
        message,
        verified: true,
        organization: result.joinedOrganization,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email. Please try again." },
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
        { error: "Verification token is required" },
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
        { error: "Invalid or expired verification token" },
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
        { error: "Verification token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Check for pending invite for this user's email
    const pendingInvite = await prisma.organizationInvite.findFirst({
      where: {
        email: verificationToken.user.email.toLowerCase(),
        status: "PENDING",
      },
      include: {
        organization: true,
      },
    });

    // Verify user email and activate account, and handle organization join
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: verificationToken.userId },
        data: {
          emailVerified: 1,
          isActive: 1,
        },
      });

      let joinedOrganization = null;

      // If there's a pending invite, join the organization
      if (pendingInvite && new Date() <= pendingInvite.expiresAt) {
        // Check if user is already a member
        const existingMembership = await tx.organizationMembership.findUnique({
          where: {
            userId_organizationId: {
              userId: user.id,
              organizationId: pendingInvite.organizationId,
            },
          },
        });

        if (!existingMembership) {
          // Create membership
          await tx.organizationMembership.create({
            data: {
              userId: user.id,
              organizationId: pendingInvite.organizationId,
              role: pendingInvite.role,
            },
          });

          // Set as default organization if user doesn't have one
          if (!user.defaultOrganizationId) {
            await tx.user.update({
              where: { id: user.id },
              data: {
                defaultOrganizationId: pendingInvite.organizationId,
              },
            });
          }

          // Mark invite as accepted
          await tx.organizationInvite.update({
            where: { id: pendingInvite.id },
            data: {
              status: "ACCEPTED",
              updatedAt: Math.floor(Date.now() / 1000),
            },
          });

          joinedOrganization = pendingInvite.organization;
        }
      }

      // Delete used verification token
      await tx.verificationToken.delete({
        where: { token },
      });

      return { user, joinedOrganization };
    });

    const message = result.joinedOrganization
      ? `Email verified successfully. You have been added to ${result.joinedOrganization.name}.`
      : "Email verified successfully. Your account has been activated.";

    return NextResponse.json(
      {
        message,
        verified: true,
        organization: result.joinedOrganization,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email. Please try again." },
      { status: 500 }
    );
  }
}
