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

    const stocks = await prisma.inventoryStock.findMany({
      where: {
        organizationId: session.user.currentOrganizationId,
      },
      include: { product: true, storageLocation: true, batch: true },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(stocks)
  } catch (error) {
    console.error('Failed to fetch inventory', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
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
    const { productId, batchId, storageLocationId, quantity, mfgDate, expiryDate } = body

    if (!productId || !storageLocationId || !quantity) {
      return NextResponse.json(
        { error: 'productId, storageLocationId and quantity are required' },
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

    // Verify storage location belongs to user's organization
    const storageLocation = await prisma.storageLocation.findFirst({
      where: {
        id: storageLocationId,
        organizationId: session.user.currentOrganizationId,
      },
    })

    if (!storageLocation) {
      return NextResponse.json(
        { error: 'Storage location not found or does not belong to your organization' },
        { status: 404 }
      )
    }

    const now = Math.floor(Date.now() / 1000)
    const parsedMfgDate = mfgDate ? Math.floor(new Date(mfgDate).getTime() / 1000) : undefined
    const parsedExpiryDate = expiryDate ? Math.floor(new Date(expiryDate).getTime() / 1000) : undefined

    const stock = await prisma.inventoryStock.create({
      data: {
        organizationId: session.user.currentOrganizationId,
        productId,
        batchId: batchId ?? undefined,
        storageLocationId,
        quantity: Number(quantity),
        mfgDate: parsedMfgDate,
        expiryDate: parsedExpiryDate,
        createdAt: now,
      },
      include: { product: true, storageLocation: true },
    })

    // Create transaction
    await prisma.inventoryTransaction.create({
      data: {
        organizationId: session.user.currentOrganizationId,
        stockId: stock.id,
        type: 'PRODUCTION_IN',
        qty: Number(quantity),
        referenceType: 'InventoryIn',
        createdAt: now,
      },
    })

    return NextResponse.json(stock, { status: 201 })
  } catch (error) {
    console.error('Failed to create inventory stock', error)
    return NextResponse.json(
      { error: 'Failed to create inventory stock' },
      { status: 500 }
    )
  }
}
