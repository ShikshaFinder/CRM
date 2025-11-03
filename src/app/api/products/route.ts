import prisma from '../../../lib/prisma'

export async function GET() {
  const products = await prisma.product.findMany({ include: { priceHistory: true } })
  return new Response(JSON.stringify(products), { headers: { 'Content-Type': 'application/json' } })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, category, subCategory, unit, packSize, unitPrice, costPrice, minFatPercent, minSnfPercent, shelfLifeDays, storageTempMin, storageTempMax, requiresColdChain } = body

  if (!name || !category || !unit) {
    return new Response(JSON.stringify({ error: 'name, category and unit are required' }), { status: 400 })
  }

  const product = await prisma.product.create({
    data: {
      name,
      category,
      subCategory,
      unit,
      packSize,
      unitPrice,
      costPrice,
      minFatPercent,
      minSnfPercent,
      shelfLifeDays,
      storageTempMin,
      storageTempMax,
      requiresColdChain: !!requiresColdChain
    }
  })

  return new Response(JSON.stringify(product), { status: 201, headers: { 'Content-Type': 'application/json' } })
}
