import prisma from '../../../../lib/prisma'

export async function GET() {
  const challans = await prisma.deliveryChallan.findMany({ orderBy: { deliveredAt: 'desc' } })
  return new Response(JSON.stringify(challans), { headers: { 'Content-Type': 'application/json' } })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { challanNumber, salesOrderId, vehicleNumber, driverName, driverPhone, tempInitialC, tempFinalC, signedBy, deliveredAt } = body
  if (!challanNumber) return new Response(JSON.stringify({ error: 'challanNumber required' }), { status: 400 })
  const c = await prisma.deliveryChallan.create({ data: { challanNumber, salesOrderId: salesOrderId ?? undefined, vehicleNumber, driverName, driverPhone, tempInitialC: tempInitialC ?? undefined, tempFinalC: tempFinalC ?? undefined, signedBy, deliveredAt: deliveredAt ? new Date(deliveredAt) : undefined } })
  return new Response(JSON.stringify(c), { status: 201 })
}
