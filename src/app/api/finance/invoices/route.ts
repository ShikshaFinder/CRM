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

    const invoices = await prisma.invoice.findMany({
      where: {
        organizationId: session.user.currentOrganizationId,
      },
      include: { salesOrder: true, payments: true },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Failed to fetch invoices', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
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
    const { invoiceNumber, salesOrderId, dueDate, totalAmount } = body

    if (!invoiceNumber || !totalAmount) {
      return NextResponse.json(
        { error: 'invoiceNumber and totalAmount are required' },
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

    const now = Math.floor(Date.now() / 1000)
    const parsedDueDate = dueDate ? Math.floor(new Date(dueDate).getTime() / 1000) : undefined

    const invoice = await prisma.invoice.create({
      data: {
        organizationId: session.user.currentOrganizationId,
        invoiceNumber,
        salesOrderId: salesOrderId ?? undefined,
        dueDate: parsedDueDate,
        totalAmount: Number(totalAmount),
        createdAt: now,
      },
      include: { salesOrder: true },
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('Failed to create invoice', error)
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
