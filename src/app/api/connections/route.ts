import prisma from '../../../lib/prisma'

export async function GET() {
  const list = await prisma.connection.findMany({ include: { contacts: true } })
  return new Response(JSON.stringify(list), { headers: { 'Content-Type': 'application/json' } })
}

export async function POST(req: Request) {
  const body = await req.json()
  const {
    name,
    type,
    businessCategory,
    gstNumber,
    creditLimit,
    paymentTermsDays,
    hasColdStorage,
    deliveryPreferences,
    contacts
  } = body

  if (!name || !type) {
    return new Response(JSON.stringify({ error: 'name and type required' }), { status: 400 })
  }

  const conn = await prisma.connection.create({
    data: {
      name,
      type,
      businessCategory,
      gstNumber,
      creditLimit: creditLimit ?? 0,
      paymentTermsDays: paymentTermsDays ?? 0,
      hasColdStorage: hasColdStorage ?? false,
      deliveryPreferences: deliveryPreferences ?? undefined,
      contacts: contacts?.length
        ? {
            create: contacts.map((c: any) => ({ fullName: c.fullName, email: c.email, phone: c.phone, isPrimary: !!c.isPrimary }))
          }
        : undefined
    },
    include: { contacts: true }
  })

  return new Response(JSON.stringify(conn), { status: 201, headers: { 'Content-Type': 'application/json' } })
}
