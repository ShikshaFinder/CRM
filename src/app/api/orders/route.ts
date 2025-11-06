import prisma from '../../../lib/prisma'

export async function GET() {
  const orders = await prisma.salesOrder.findMany({ include: { items: { include: { product: true, batch: true } }, connection: true, invoices: true } })
  return new Response(JSON.stringify(orders), { headers: { 'Content-Type': 'application/json' } })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { orderRef, connectionId, stage, deliveryAddress, distanceKm, vehicleReq, items } = body

  if (!orderRef || !connectionId || !items || !items.length) return new Response(JSON.stringify({ error: 'orderRef, connectionId and items are required' }), { status: 400 })

  const order = await prisma.salesOrder.create({
    data: {
      orderRef,
      connectionId,
      stage: stage ?? 'Pending',
      deliveryAddress,
      distanceKm,
      vehicleReq,
      items: {
        create: items.map((it: any) => ({ productId: it.productId, qty: it.qty, price: it.price, batchId: it.batchId ?? undefined, mfgDate: it.mfgDate ? new Date(it.mfgDate) : undefined, expiryDate: it.expiryDate ? new Date(it.expiryDate) : undefined }))
      }
    },
    include: { items: true }
  })

  return new Response(JSON.stringify(order), { status: 201, headers: { 'Content-Type': 'application/json' } })
}
