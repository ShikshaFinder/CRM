import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const url = new URL(req.url)
    const severity = url.searchParams.get('severity')
    const acknowledged = url.searchParams.get('acknowledged')

    const alerts = await prisma.processAlert.findMany({
      where: {
        organizationId: session.user.currentOrganizationId,
        severity: severity || undefined,
        acknowledged:
          acknowledged === null
            ? undefined
            : acknowledged === 'true'
            ? 1
            : acknowledged === 'false'
            ? 0
            : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Failed to fetch process alerts', error)
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await req.json()
    const { alertId, acknowledged } = body
    if (!alertId) {
      return NextResponse.json({ error: 'alertId is required' }, { status: 400 })
    }

    const alert = await prisma.processAlert.findFirst({
      where: { id: alertId, organizationId: session.user.currentOrganizationId },
    })
    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
    }

    const updated = await prisma.processAlert.update({
      where: { id: alertId },
      data: {
        acknowledged: acknowledged ? 1 : 0,
        acknowledgedAt: acknowledged ? Math.floor(Date.now() / 1000) : null,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update process alert', error)
    return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 })
  }
}


