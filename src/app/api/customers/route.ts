import prisma from '../../../lib/prisma'
import { getServerSession } from 'next-auth'
import authOptions from '../../../lib/auth'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const customers = await prisma.connection.findMany({
      where: {
        organizationId: session.user.currentOrganizationId,
      },
      include: { contacts: true, procurements: true, salesOrders: true }
    })
    return new Response(JSON.stringify(customers), { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch customers' }), { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const body = await req.json()
    const { name, type, businessCategory, gstNumber, creditLimit, paymentTermsDays, hasColdStorage, deliveryPreferences, contacts } = body

    if (!name) return new Response(JSON.stringify({ error: 'name required' }), { status: 400 })

    const now = Math.floor(Date.now() / 1000)

    const conn = await prisma.connection.create({
      data: {
        organizationId: session.user.currentOrganizationId,
        name,
        type: type ?? 'UNKNOWN',
        businessCategory: businessCategory ?? 'B2C',
        gstNumber,
        creditLimit: creditLimit ?? 0,
        paymentTermsDays: paymentTermsDays ?? 0,
        hasColdStorage: hasColdStorage ? 1 : 0,
        deliveryPreferences,
        createdAt: now,
        updatedAt: now,
        contacts: contacts?.length ? { create: contacts.map((c: any) => ({ fullName: c.fullName, email: c.email, phone: c.phone, isPrimary: c.isPrimary ? 1 : 0 })) } : undefined
      },
      include: { contacts: true }
    })

    return new Response(JSON.stringify(conn), { status: 201, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create customer' }), { status: 500 })
  }
}
