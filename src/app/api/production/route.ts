import prisma from '../../../lib/prisma'

export async function GET() {
  const batches = await prisma.productionBatch.findMany({ include: { product: true, items: true, inventoryStocks: true } })
  return new Response(JSON.stringify(batches), { headers: { 'Content-Type': 'application/json' } })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { batchNumber, productId, producedQty, productionDate, manufacturingDate, expiryDate, status, items } = body
  if (!batchNumber || !productId) return new Response(JSON.stringify({ error: 'batchNumber and productId required' }), { status: 400 })

  const batch = await prisma.productionBatch.create({
    data: {
      batchNumber,
      productId,
      producedQty: producedQty ?? 0,
      productionDate: productionDate ? new Date(productionDate) : undefined,
      manufacturingDate: manufacturingDate ? new Date(manufacturingDate) : undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      status: status ?? 'IN_PRODUCTION',
      items: items?.length ? { create: items.map((it: any) => ({ productId: it.productId, rawMilkUsedL: it.rawMilkUsedL ?? 0, quantity: it.quantity })) } : undefined
    },
    include: { items: true }
  })

  return new Response(JSON.stringify(batch), { status: 201, headers: { 'Content-Type': 'application/json' } })
}
