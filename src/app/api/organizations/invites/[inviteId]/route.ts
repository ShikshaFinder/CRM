import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";
import { sendInvitationEmail } from "../../../../../lib/email";

export async function DELETE(
  req: Request,
  { params }: { params: { inviteId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inviteId = params.inviteId;

    // Get the invite
    const invite = await prisma.organizationInvite.findUnique({
      where: { id: inviteId },
      include: {
        organization: true,
      },
    });

    if (!invite) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Check if user is an admin of the organization
    const membership = await prisma.organizationMembership.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId: invite.organizationId,
        },
      },
    });

    if (!membership || membership.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only organization admins can cancel invitations" },
        { status: 403 }
      );
    }

    // Update invite status to CANCELLED
    const now = Math.floor(Date.now() / 1000);
    await prisma.organizationInvite.update({
      where: { id: inviteId },
      data: {
        status: "CANCELLED",
        updatedAt: now,
      },
    });

    return NextResponse.json({ message: "Invitation cancelled" });
  } catch (error: any) {
    console.error("Cancel invitation error:", error);
    return NextResponse.json(
      { error: "Failed to cancel invitation" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { inviteId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inviteId = params.inviteId;

    // Get the invite
    const invite = await prisma.organizationInvite.findUnique({
      where: { id: inviteId },
      include: {
        organization: true,
        invitedBy: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!invite) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Check if user is an admin of the organization
    const membership = await prisma.organizationMembership.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId: invite.organizationId,
        },
      },
    });

    if (!membership || membership.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only organization admins can resend invitations" },
        { status: 403 }
      );
    }

    // Check if invite is still pending
    if (invite.status !== "PENDING") {
      return NextResponse.json(
        { error: "Can only resend pending invitations" },
        { status: 400 }
      );
    }

    // Resend invitation email
    const emailResult = await sendInvitationEmail(
      invite.email,
      invite.token,
      invite.organization.name,
      invite.invitedBy.profile?.fullName || invite.invitedBy.email
    );

    if (!emailResult.success) {
      console.error("Failed to resend invitation email:", emailResult.error);
      return NextResponse.json(
        { error: "Failed to resend invitation email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Invitation resent successfully" });
  } catch (error: any) {
    console.error("Resend invitation error:", error);
    return NextResponse.json(
      { error: "Failed to resend invitation" },
      { status: 500 }
    );
  }
}

