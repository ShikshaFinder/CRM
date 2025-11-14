import prisma from "../../../lib/prisma";

const jsonResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { user: true, organization: true },
    });

    const tickets = await prisma.supportTicket.findMany({
      include: { comments: true, organization: true, connection: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return jsonResponse({ notifications, tickets });
  } catch (error) {
    console.error("Failed to fetch communications feed", error);
    return jsonResponse({ error: "Failed to fetch communications feed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const now = Math.floor(Date.now() / 1000);

  if (body.type === "notification") {
    const { userId, organizationId, title, body: msg } = body;

    if (!userId || !organizationId || !title) {
      return jsonResponse(
        { error: "userId, organizationId and title are required" },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        user: { connect: { id: userId } },
        organization: { connect: { id: organizationId } },
        title,
        body: msg ?? null,
        createdAt: now,
      },
    });

    return jsonResponse(notification, { status: 201 });
  }

  if (body.type === "ticket") {
    const {
      ticketNumber,
      connectionId,
      organizationId,
      issueType,
      priority,
      status,
    } = body;

    if (!connectionId || !organizationId || !issueType) {
      return jsonResponse(
        { error: "connectionId, organizationId and issueType are required" },
        { status: 400 }
      );
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber: ticketNumber ?? `T-${Date.now()}`,
        connection: { connect: { id: connectionId } },
        organization: { connect: { id: organizationId } },
        issueType,
        priority: priority ?? "MEDIUM",
        status: status ?? "OPEN",
        createdAt: now,
      },
      include: { comments: true },
    });

    return jsonResponse(ticket, { status: 201 });
  }

  return jsonResponse({ error: "type must be notification or ticket" }, { status: 400 });
}
