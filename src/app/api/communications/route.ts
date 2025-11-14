import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../../lib/auth";
import prisma from "../../../lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        organizationId: session.user.currentOrganizationId,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { user: true, organization: true },
    });

    const tickets = await prisma.supportTicket.findMany({
      where: {
        organizationId: session.user.currentOrganizationId,
      },
      include: { comments: true, organization: true, connection: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ notifications, tickets });
  } catch (error) {
    console.error("Failed to fetch communications feed", error);
    return NextResponse.json(
      { error: "Failed to fetch communications feed" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const now = Math.floor(Date.now() / 1000);

    if (body.type === "notification") {
      const { userId, title, body: msg } = body;

      if (!userId || !title) {
        return NextResponse.json(
          { error: "userId and title are required" },
          { status: 400 }
        );
      }

      // Verify user is member of the organization
      const userMembership = await prisma.organizationMembership.findUnique({
        where: {
          userId_organizationId: {
            userId,
            organizationId: session.user.currentOrganizationId,
          },
        },
      });

      if (!userMembership) {
        return NextResponse.json(
          { error: "User is not a member of this organization" },
          { status: 403 }
        );
      }

      const notification = await prisma.notification.create({
        data: {
          userId,
          organizationId: session.user.currentOrganizationId,
          title,
          body: msg ?? null,
          createdAt: now,
        },
        include: { user: true },
      });

      return NextResponse.json(notification, { status: 201 });
    }

    if (body.type === "ticket") {
      const {
        ticketNumber,
        connectionId,
        issueType,
        priority,
        status,
      } = body;

      if (!connectionId || !issueType) {
        return NextResponse.json(
          { error: "connectionId and issueType are required" },
          { status: 400 }
        );
      }

      // Verify connection belongs to user's organization
      const connection = await prisma.connection.findFirst({
        where: {
          id: connectionId,
          organizationId: session.user.currentOrganizationId,
        },
      });

      if (!connection) {
        return NextResponse.json(
          { error: "Connection not found or does not belong to your organization" },
          { status: 404 }
        );
      }

      const ticket = await prisma.supportTicket.create({
        data: {
          ticketNumber: ticketNumber ?? `T-${Date.now()}`,
          connectionId,
          organizationId: session.user.currentOrganizationId,
          issueType,
          priority: priority ?? "MEDIUM",
          status: status ?? "OPEN",
          createdAt: now,
        },
        include: { comments: true, connection: true },
      });

      return NextResponse.json(ticket, { status: 201 });
    }

    return NextResponse.json(
      { error: "type must be notification or ticket" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Failed to create communication", error);
    return NextResponse.json(
      { error: "Failed to create communication" },
      { status: 500 }
    );
  }
}
