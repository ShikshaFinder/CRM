import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = params.id;

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

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        owner: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(organization);
  } catch (error: any) {
    console.error("Get organization error:", error);
    return NextResponse.json(
      { error: "Failed to fetch organization" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = params.id;
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 }
      );
    }

    // Check if user is an admin of the organization
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
        { error: "Only organization admins can update organization details" },
        { status: 403 }
      );
    }

    const now = Math.floor(Date.now() / 1000);

    const organization = await prisma.organization.update({
      where: { id: organizationId },
      data: {
        name: name.trim(),
        updatedAt: now,
      },
      include: {
        owner: {
          include: {
            profile: true,
          },
        },
      },
    });

    return NextResponse.json(organization);
  } catch (error: any) {
    console.error("Update organization error:", error);
    return NextResponse.json(
      { error: "Failed to update organization" },
      { status: 500 }
    );
  }
}

