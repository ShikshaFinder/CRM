import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Invitation token is required" },
        { status: 400 }
      );
    }

    // Find the invitation
    const invite = await prisma.organizationInvite.findUnique({
      where: { token },
      include: {
        organization: true,
      },
    });

    if (!invite) {
      return NextResponse.json(
        { error: "Invalid invitation token" },
        { status: 400 }
      );
    }

    // Check if invitation is still pending
    if (invite.status !== "PENDING") {
      return NextResponse.json(
        { error: "This invitation is no longer valid" },
        { status: 400 }
      );
    }

    // Check if invitation is expired
    if (new Date() > invite.expiresAt) {
      const now = Math.floor(Date.now() / 1000);
      await prisma.organizationInvite.update({
        where: { id: invite.id },
        data: {
          status: "EXPIRED",
          updatedAt: now,
        },
      });
      return NextResponse.json(
        { error: "This invitation has expired" },
        { status: 400 }
      );
    }

    // Verify that the email matches the session user's email
    if (invite.email.toLowerCase() !== session.user.email?.toLowerCase()) {
      return NextResponse.json(
        {
          error:
            "This invitation was sent to a different email address. Please sign in with the email that received the invitation.",
        },
        { status: 403 }
      );
    }

    // Check if user is already a member
    const existingMembership = await prisma.organizationMembership.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId: invite.organizationId,
        },
      },
    });

    if (existingMembership) {
      // Mark invite as accepted even though membership already exists
      const now = Math.floor(Date.now() / 1000);
      await prisma.organizationInvite.update({
        where: { id: invite.id },
        data: {
          status: "ACCEPTED",
          updatedAt: now,
        },
      });
      return NextResponse.json({
        message: "You are already a member of this organization",
        organizationId: invite.organizationId,
      });
    }

    // Create membership
    const now = Math.floor(Date.now() / 1000);
    await prisma.$transaction([
      prisma.organizationMembership.create({
        data: {
          userId: session.user.id,
          organizationId: invite.organizationId,
          role: invite.role,
        },
      }),
      prisma.organizationInvite.update({
        where: { id: invite.id },
        data: {
          status: "ACCEPTED",
          updatedAt: now,
        },
      }),
    ]);

    return NextResponse.json({
      message: "Invitation accepted successfully",
      organizationId: invite.organizationId,
    });
  } catch (error: any) {
    console.error("Accept invitation error:", error);
    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 }
    );
  }
}

