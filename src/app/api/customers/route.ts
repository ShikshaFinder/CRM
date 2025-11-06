import prisma from '../../../lib/prisma'

export async function GET() {
  const customers = await prisma.connection.findMany({
    include: { contacts: true, procurements: true, salesOrders: true }
  })
  return new Response(JSON.stringify(customers), { headers: { 'Content-Type': 'application/json' } })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, type, businessCategory, gstNumber, creditLimit, paymentTermsDays, hasColdStorage, deliveryPreferences, contacts } = body

  if (!name) return new Response(JSON.stringify({ error: 'name required' }), { status: 400 })

  const conn = await prisma.connection.create({
    data: {
      name,
      type: type ?? 'UNKNOWN',
      businessCategory: businessCategory ?? 'B2C',
      gstNumber,
      creditLimit: creditLimit ?? 0,
      paymentTermsDays: paymentTermsDays ?? 0,
      hasColdStorage: !!hasColdStorage,
      deliveryPreferences,
      contacts: contacts?.length ? { create: contacts.map((c: any) => ({ fullName: c.fullName, email: c.email, phone: c.phone, isPrimary: !!c.isPrimary })) } : undefined
    },
    include: { contacts: true }
  })

  return new Response(JSON.stringify(conn), { status: 201, headers: { 'Content-Type': 'application/json' } })
}
