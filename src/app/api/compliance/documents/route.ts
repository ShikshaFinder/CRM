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

    const documents = await prisma.document.findMany({
      where: {
        organizationId: session.user.currentOrganizationId,
      },
      orderBy: { uploadedAt: 'desc' },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Failed to fetch documents', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
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
    const { name, path, category, relatedType, relatedId } = body

    if (!name || !path) {
      return NextResponse.json(
        { error: 'name and path are required' },
        { status: 400 }
      )
    }

    const now = Math.floor(Date.now() / 1000)

    const document = await prisma.document.create({
      data: {
        organizationId: session.user.currentOrganizationId,
        name,
        path,
        category: category ?? undefined,
        relatedType: relatedType ?? undefined,
        relatedId: relatedId ?? undefined,
        uploadedById: session.user.id,
        uploadedAt: now,
      },
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Failed to create document', error)
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    )
  }
}
