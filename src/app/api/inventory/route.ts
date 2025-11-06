import prisma from '../../../lib/prisma'

export async function GET() {
  const stocks = await prisma.inventoryStock.findMany({ include: { product: true, storageLocation: true, batch: true } })
  return new Response(JSON.stringify(stocks), { headers: { 'Content-Type': 'application/json' } })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { productId, batchId, storageLocationId, quantity, mfgDate, expiryDate } = body
  if (!productId || !storageLocationId || !quantity) return new Response(JSON.stringify({ error: 'productId, storageLocationId and quantity required' }), { status: 400 })

  const stock = await prisma.inventoryStock.create({ data: { productId, batchId: batchId ?? undefined, storageLocationId, quantity: Number(quantity), mfgDate: mfgDate ? new Date(mfgDate) : undefined, expiryDate: expiryDate ? new Date(expiryDate) : undefined } })
  // create transaction
  await prisma.inventoryTransaction.create({ data: { stockId: stock.id, type: 'PRODUCTION_IN', qty: Number(quantity), referenceType: 'InventoryIn', createdAt: new Date() } })

  return new Response(JSON.stringify(stock), { status: 201, headers: { 'Content-Type': 'application/json' } })
}
