import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '../../../lib/auth'
import prisma from '../../../lib/prisma'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const connections = await prisma.connection.findMany({
      where: {
        organizationId: session.user.currentOrganizationId,
      },
      include: { contacts: true },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(connections)
  } catch (error) {
    console.error('Failed to fetch connections', error)
    return NextResponse.json(
      { error: 'Failed to fetch connections' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      contacts,
    } = body

    if (!name || !type) {
      return NextResponse.json(
        { error: 'name and type are required' },
        { status: 400 }
      )
    }

    const now = Math.floor(Date.now() / 1000)

    const connection = await prisma.connection.create({
      data: {
        organizationId: session.user.currentOrganizationId,
        name,
        type,
        businessCategory: businessCategory ?? 'B2C',
        gstNumber,
        creditLimit: creditLimit ?? 0,
        paymentTermsDays: paymentTermsDays ?? 0,
        hasColdStorage: hasColdStorage ? 1 : 0,
        deliveryPreferences: deliveryPreferences ?? undefined,
        createdAt: now,
        updatedAt: now,
        contacts: contacts?.length
          ? {
              create: contacts.map((contact: {
                fullName: string
                email?: string
                phone?: string
                isPrimary?: boolean
              }) => ({
                fullName: contact.fullName,
                email: contact.email,
                phone: contact.phone,
                isPrimary: contact.isPrimary ? 1 : 0,
              })),
            }
          : undefined,
      },
      include: { contacts: true },
    })

    return NextResponse.json(connection, { status: 201 })
  } catch (error) {
    console.error('Failed to create connection', error)
    return NextResponse.json(
      { error: 'Failed to create connection' },
      { status: 500 }
    )
  }
}
