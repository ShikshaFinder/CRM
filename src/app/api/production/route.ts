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

    const batches = await prisma.productionBatch.findMany({
      where: {
        organizationId: session.user.currentOrganizationId,
      },
      include: { product: true, items: true, inventoryStocks: true },
      orderBy: {
        productionDate: 'desc',
      },
    })

    return NextResponse.json(batches)
  } catch (error) {
    console.error('Failed to fetch production batches', error)
    return NextResponse.json(
      { error: 'Failed to fetch production batches' },
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
    const { batchNumber, productId, producedQty, productionDate, manufacturingDate, expiryDate, status, items } = body

    if (!batchNumber || !productId) {
      return NextResponse.json(
        { error: 'batchNumber and productId are required' },
        { status: 400 }
      )
    }

    // Verify product belongs to user's organization
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        organizationId: session.user.currentOrganizationId,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or does not belong to your organization' },
        { status: 404 }
      )
    }

    const parsedProductionDate = productionDate ? Math.floor(new Date(productionDate).getTime() / 1000) : Math.floor(Date.now() / 1000)
    const parsedManufacturingDate = manufacturingDate ? Math.floor(new Date(manufacturingDate).getTime() / 1000) : undefined
    const parsedExpiryDate = expiryDate ? Math.floor(new Date(expiryDate).getTime() / 1000) : undefined

    const batch = await prisma.productionBatch.create({
      data: {
        organizationId: session.user.currentOrganizationId,
        batchNumber,
        productId,
        producedQty: producedQty ?? 0,
        productionDate: parsedProductionDate,
        manufacturingDate: parsedManufacturingDate,
        expiryDate: parsedExpiryDate,
        status: status ?? 'IN_PRODUCTION',
        items: items?.length
          ? {
              create: items.map((item: {
                productId: string
                rawMilkUsedL?: number
                quantity?: number
              }) => ({
                productId: item.productId,
                rawMilkUsedL: item.rawMilkUsedL ?? 0,
                quantity: item.quantity ?? 0,
              })),
            }
          : undefined,
      },
      include: { items: true, product: true },
    })

    return NextResponse.json(batch, { status: 201 })
  } catch (error) {
    console.error('Failed to create production batch', error)
    return NextResponse.json(
      { error: 'Failed to create production batch' },
      { status: 500 }
    )
  }
}
