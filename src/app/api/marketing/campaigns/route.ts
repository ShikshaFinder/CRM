import prisma from '../../../../lib/prisma'

export async function GET() {
  const campaigns = await prisma.activity.findMany({ where: { type: 'campaign' }, orderBy: { createdAt: 'desc' }, take: 100 })
  return new Response(JSON.stringify(campaigns), { headers: { 'Content-Type': 'application/json' } })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, startDate, endDate, notes } = body
  if (!name) return new Response(JSON.stringify({ error: 'name required' }), { status: 400 })
  const campaign = await prisma.activity.create({ data: { type: 'campaign', notes: notes ?? null, relatedType: 'campaign', relatedId: null, createdAt: startDate ? new Date(startDate) : undefined } })
  return new Response(JSON.stringify(campaign), { status: 201 })
}
