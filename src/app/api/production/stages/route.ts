import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/auth'
import prisma from '@/lib/prisma'

const toUnixSeconds = (value?: string | number | Date | null) => {
  if (!value) return undefined
  if (typeof value === 'number') return value
  return Math.floor(new Date(value).getTime() / 1000)
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const url = new URL(req.url)
    const batchId = url.searchParams.get('batchId')
    const stageName = url.searchParams.get('stage')

    const logs = await prisma.productionStageLog.findMany({
      where: {
        organizationId: session.user.currentOrganizationId,
        batchId: batchId || undefined,
        stageName: stageName || undefined,
      },
      orderBy: {
        startedAt: 'asc',
      },
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Failed to fetch stage logs', error)
    return NextResponse.json({ error: 'Failed to fetch stage logs' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { batchId, stageName, status, parameters, remarks, startedAt, completedAt } = body

    if (!batchId || !stageName) {
      return NextResponse.json({ error: 'batchId and stageName are required' }, { status: 400 })
    }

    const batch = await prisma.productionBatch.findFirst({
      where: { id: batchId, organizationId: session.user.currentOrganizationId },
    })
    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 })
    }

    const log = await prisma.productionStageLog.create({
      data: {
        organizationId: session.user.currentOrganizationId,
        batchId,
        stageName,
        status: status ?? 'IN_PROGRESS',
        parameters: parameters ? JSON.stringify(parameters) : undefined,
        remarks,
        recordedById: session.user.id,
        startedAt: toUnixSeconds(startedAt) ?? Math.floor(Date.now() / 1000),
        completedAt: toUnixSeconds(completedAt),
      },
    })

    if (status === 'FAIL') {
      await prisma.processAlert.create({
        data: {
          organizationId: session.user.currentOrganizationId,
          batchId,
          stageLogId: log.id,
          alertType: `${stageName}_FAIL`,
          severity: 'CRITICAL',
          message: remarks || `${stageName} failed`,
          createdAt: Math.floor(Date.now() / 1000),
        },
      })
    }

    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    console.error('Failed to create stage log', error)
    return NextResponse.json({ error: 'Failed to create stage log' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { stageLogId, status, acknowledged } = body
    if (!stageLogId) {
      return NextResponse.json({ error: 'stageLogId is required' }, { status: 400 })
    }

    const log = await prisma.productionStageLog.findFirst({
      where: { id: stageLogId, organizationId: session.user.currentOrganizationId },
    })
    if (!log) {
      return NextResponse.json({ error: 'Stage log not found' }, { status: 404 })
    }

    const updated = await prisma.productionStageLog.update({
      where: { id: stageLogId },
      data: {
        status,
        completedAt: status === 'COMPLETED' ? Math.floor(Date.now() / 1000) : undefined,
      },
    })

    if (acknowledged) {
      await prisma.processAlert.updateMany({
        where: { stageLogId, organizationId: session.user.currentOrganizationId, acknowledged: 0 },
        data: {
          acknowledged: 1,
          acknowledgedAt: Math.floor(Date.now() / 1000),
        },
      })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update stage log', error)
    return NextResponse.json({ error: 'Failed to update stage log' }, { status: 500 })
  }
}


