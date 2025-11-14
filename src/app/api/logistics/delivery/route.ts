import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '../../../../lib/auth'
import prisma from '../../../../lib/prisma'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const challans = await prisma.deliveryChallan.findMany({
      where: {
        organizationId: session.user.currentOrganizationId,
      },
      orderBy: { deliveredAt: 'desc' },
      include: { salesOrder: true },
    })

    return NextResponse.json(challans)
  } catch (error) {
    console.error('Failed to fetch delivery challans', error)
    return NextResponse.json(
      { error: 'Failed to fetch delivery challans' },
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
    const { challanNumber, salesOrderId, vehicleNumber, driverName, driverPhone, tempInitialC, tempFinalC, signedBy, deliveredAt } = body

    if (!challanNumber) {
      return NextResponse.json(
        { error: 'challanNumber is required' },
        { status: 400 }
      )
    }

    // Verify salesOrder belongs to user's organization if provided
    if (salesOrderId) {
      const salesOrder = await prisma.salesOrder.findFirst({
        where: {
          id: salesOrderId,
          organizationId: session.user.currentOrganizationId,
        },
      })

      if (!salesOrder) {
        return NextResponse.json(
          { error: 'Sales order not found or does not belong to your organization' },
          { status: 404 }
        )
      }
    }

    const parsedDeliveredAt = deliveredAt ? Math.floor(new Date(deliveredAt).getTime() / 1000) : undefined

    const challan = await prisma.deliveryChallan.create({
      data: {
        organizationId: session.user.currentOrganizationId,
        challanNumber,
        salesOrderId: salesOrderId ?? undefined,
        vehicleNumber,
        driverName,
        driverPhone,
        tempInitialC: tempInitialC ?? undefined,
        tempFinalC: tempFinalC ?? undefined,
        signedBy,
        deliveredAt: parsedDeliveredAt,
      },
      include: { salesOrder: true },
    })

    return NextResponse.json(challan, { status: 201 })
  } catch (error) {
    console.error('Failed to create delivery challan', error)
    return NextResponse.json(
      { error: 'Failed to create delivery challan' },
      { status: 500 }
    )
  }
}
