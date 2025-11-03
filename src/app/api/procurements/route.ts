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
      supplierId,
      collectionCenterId: collectionCenterId ?? undefined,
      datetime: datetime ? new Date(datetime) : undefined,
      quantityL: Number(quantityL),
      fatPercent: fatPercent ?? undefined,
      snfPercent: snfPercent ?? undefined,
      clrReading: clrReading ?? undefined,
      temperatureC: temperatureC ?? undefined,
      qualityGrade: qualityGrade ?? 'A',
      ratePerLitre: Number(ratePerLitre),
      totalAmount: totalAmount ?? Number(quantityL) * Number(ratePerLitre),
      paymentStatus: paymentStatus ?? 'PENDING',
      milkType: milkType ?? undefined
    }
  })

  return new Response(JSON.stringify(entry), { status: 201, headers: { 'Content-Type': 'application/json' } })
}
