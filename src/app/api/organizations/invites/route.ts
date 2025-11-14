import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { randomBytes } from "crypto";
import { sendInvitationEmail } from "../../../../lib/email";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { organizationId, email, role } = body;

    if (!organizationId || !email || !role) {
      return NextResponse.json(
        { error: "organizationId, email, and role are required" },
        { status: 400 }
      );
    }

    if (role !== "ADMIN" && role !== "MEMBER") {
      return NextResponse.json(
        { error: "Role must be ADMIN or MEMBER" },
        { status: 400 }
      );
    }

    // Check if user is a member of the organization
    const membership = await prisma.organizationMembership.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId,
        },
      },
    });

    if (!membership || membership.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only organization admins can send invitations" },
        { status: 403 }
      );
    }

    // Check if user already exists and is already a member
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        memberships: {
          where: { organizationId },
        },
      },
    });

    if (existingUser?.memberships.length > 0) {
      return NextResponse.json(
        { error: "User is already a member of this organization" },
        { status: 400 }
      );
    }

    // Check if there's already a pending invite for this email
    const existingInvite = await prisma.organizationInvite.findFirst({
      where: {
        organizationId,
        email: email.toLowerCase(),
        status: "PENDING",
      },
    });

    if (existingInvite) {
      return NextResponse.json(
        { error: "An invitation is already pending for this email" },
        { status: 400 }
      );
    }

    // Generate invitation token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const now = Math.floor(Date.now() / 1000);

    // Create invitation
    const invite = await prisma.organizationInvite.create({
      data: {
        organizationId,
        email: email.toLowerCase(),
        role,
        invitedById: session.user.id,
        token,
        expiresAt,
        createdAt: now,
        updatedAt: now,
      },
      include: {
        organization: true,
        invitedBy: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Send invitation email
    const emailResult = await sendInvitationEmail(
      invite.email,
      token,
      invite.organization.name,
      invite.invitedBy.profile?.fullName || invite.invitedBy.email
    );

    if (!emailResult.success) {
      console.error("Failed to send invitation email:", emailResult.error);
      // Don't fail the request, but log the error
    } else {
      console.log(`Invitation sent to ${invite.email} for organization ${invite.organization.name} by ${session.user.id}`);
    }

    return NextResponse.json(
      {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        status: invite.status,
        expiresAt: invite.expiresAt,
        createdAt: invite.createdAt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create invitation error:", error);
    return NextResponse.json(
      { error: "Failed to create invitation" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json(
        { error: "organizationId is required" },
        { status: 400 }
      );
    }

    // Check if user is a member of the organization
    const membership = await prisma.organizationMembership.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this organization" },
        { status: 403 }
      );
    }

    // Get all invites for this organization
    const invites = await prisma.organizationInvite.findMany({
      where: {
        organizationId,
        status: {
          in: ["PENDING", "EXPIRED"],
        },
      },
      include: {
        invitedBy: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invites);
  } catch (error: any) {
    console.error("Get invitations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}

