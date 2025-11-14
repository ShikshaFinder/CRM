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

    const orders = await prisma.salesOrder.findMany({
      where: {
        organizationId: session.user.currentOrganizationId,
      },
      include: {
        items: {
          include: { product: true, batch: true },
        },
        connection: true,
        invoices: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Failed to fetch orders', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
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
    const { orderRef, connectionId, stage, deliveryAddress, distanceKm, vehicleReq, items } = body

    if (!orderRef || !connectionId || !items || !items.length) {
      return NextResponse.json(
        { error: 'orderRef, connectionId and items are required' },
        { status: 400 }
      )
    }

    // Verify connection belongs to user's organization
    const connection = await prisma.connection.findFirst({
      where: {
        id: connectionId,
        organizationId: session.user.currentOrganizationId,
      },
    })

    if (!connection) {
      return NextResponse.json(
        { error: 'Connection not found or does not belong to your organization' },
        { status: 404 }
      )
    }

    const now = Math.floor(Date.now() / 1000)

    const order = await prisma.salesOrder.create({
      data: {
        organizationId: session.user.currentOrganizationId,
        orderRef,
        connectionId,
        stage: stage ?? 'Pending',
        deliveryAddress,
        distanceKm,
        vehicleReq,
        createdAt: now,
        items: {
          create: items.map((item: {
            productId: string
            qty: number
            price: number
            batchId?: string
            mfgDate?: string
            expiryDate?: string
          }) => ({
            organizationId: session.user.currentOrganizationId,
            productId: item.productId,
            qty: item.qty,
            price: item.price,
            batchId: item.batchId ?? undefined,
            mfgDate: item.mfgDate ? Math.floor(new Date(item.mfgDate).getTime() / 1000) : undefined,
            expiryDate: item.expiryDate ? Math.floor(new Date(item.expiryDate).getTime() / 1000) : undefined,
          })),
        },
      },
      include: { items: true },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Failed to create order', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
