import prisma from '../../../lib/prisma'

export async function GET() {
  // return both notifications and support tickets summary
  const notifications = await prisma.notification.findMany({ orderBy: { createdAt: 'desc' }, take: 100 })
  const tickets = await prisma.supportTicket.findMany({ include: { comments: true }, orderBy: { createdAt: 'desc' }, take: 100 })
  return new Response(JSON.stringify({ notifications, tickets }), { headers: { 'Content-Type': 'application/json' } })
}

export async function POST(req: Request) {
  const body = await req.json()
  if (body.type === 'notification') {
    const { userId, title, body: msg } = body
    if (!userId || !title) return new Response(JSON.stringify({ error: 'userId and title required' }), { status: 400 })
    const n = await prisma.notification.create({ 
      data: { 
        user: { connect: { id: userId } },
        title, 
        body: msg,
        createdAt: Math.floor(Date.now() / 1000)
      } 
    })
    return new Response(JSON.stringify(n), { status: 201 })
  }

  if (body.type === 'ticket') {
    const { ticketNumber, connectionId, issueType, priority, status } = body
    const t = await prisma.supportTicket.create({ 
      data: { 
        ticketNumber: ticketNumber ?? `T-${Date.now()}`, 
        connection: { connect: { id: connectionId } },
        issueType, 
        priority: priority ?? 'MEDIUM', 
        status: status ?? 'OPEN',
        createdAt: Math.floor(Date.now() / 1000)
      } 
    })
    return new Response(JSON.stringify(t), { status: 201 })
  }

  return new Response(JSON.stringify({ error: 'unknown type' }), { status: 400 })
}
