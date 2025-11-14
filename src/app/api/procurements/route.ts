import prisma from '../../../lib/prisma'

export async function GET() {
  const list = await prisma.milkProcurementEntry.findMany({ include: { supplier: true, collectionCenter: true } })
  return new Response(JSON.stringify(list), { headers: { 'Content-Type': 'application/json' } })
}

export async function POST(req: Request) {
  const body = await req.json()
  const {
    supplierId,
    collectionCenterId,
    datetime,
    quantityL,
    fatPercent,
    snfPercent,
    clrReading,
    temperatureC,
    qualityGrade,
    ratePerLitre,
    totalAmount,
    paymentStatus,
    milkType
  } = body

  if (!supplierId || !quantityL || !ratePerLitre) {
    return new Response(JSON.stringify({ error: 'supplierId, quantityL and ratePerLitre are required' }), { status: 400 })
  }

  const entry = await prisma.milkProcurementEntry.create({
    data: {
      supplier: {
        connect: { id: supplierId }
      },
      collectionCenter: collectionCenterId ? {
        connect: { id: collectionCenterId }
      } : undefined,
      datetime: datetime ? Math.floor(new Date(datetime).getTime() / 1000) : Math.floor(Date.now() / 1000),
      quantityL: Number(quantityL),
      fatPercent: fatPercent ? Number(fatPercent) : null,
      snfPercent: snfPercent ? Number(snfPercent) : null,
      clrReading: clrReading ? Number(clrReading) : null,
      temperatureC: temperatureC ? Number(temperatureC) : null,
      qualityGrade: qualityGrade ?? 'A',
      ratePerLitre: Number(ratePerLitre),
      totalAmount: totalAmount ? Number(totalAmount) : Number(quantityL) * Number(ratePerLitre),
      paymentStatus: paymentStatus ?? 'PENDING',
      milkType: milkType ?? null,
      createdAt: Math.floor(Date.now() / 1000)
    }
  })

  return new Response(JSON.stringify(entry), { status: 201, headers: { 'Content-Type': 'application/json' } })
}
