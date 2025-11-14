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

    const campaigns = await prisma.activity.findMany({
      where: {
        organizationId: session.user.currentOrganizationId,
        type: 'campaign',
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error('Failed to fetch campaigns', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
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
    const { name, startDate, endDate, notes } = body

    if (!name) {
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 }
      )
    }

    const now = Math.floor(Date.now() / 1000)
    const parsedStartDate = startDate ? Math.floor(new Date(startDate).getTime() / 1000) : now

    const campaign = await prisma.activity.create({
      data: {
        organizationId: session.user.currentOrganizationId,
        userId: session.user.id,
        type: 'campaign',
        notes: notes ?? null,
        relatedType: 'campaign',
        relatedId: null,
        createdAt: parsedStartDate,
      },
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error('Failed to create campaign', error)
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
}
