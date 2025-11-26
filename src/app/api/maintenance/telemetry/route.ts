import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/auth'
import prisma from '@/lib/prisma'

const toUnixSeconds = (value?: string | number | Date | null) => {
  if (!value) return Math.floor(Date.now() / 1000)
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
    const machineType = url.searchParams.get('machineType')
    const limit = Number(url.searchParams.get('limit') ?? 50)

    const telemetry = await prisma.machineTelemetry.findMany({
      where: {
        organizationId: session.user.currentOrganizationId,
        machineType: machineType || undefined,
      },
      orderBy: {
        recordedAt: 'desc',
      },
      take: Math.min(limit, 200),
    })
    return NextResponse.json(telemetry)
  } catch (error) {
    console.error('Failed to fetch telemetry', error)
    return NextResponse.json({ error: 'Failed to fetch telemetry' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await req.json()
    const { machineType, machineId, parameter, value, unit, batchId, packagingLineId, notes, recordedAt } = body
    if (!machineType || !parameter) {
      return NextResponse.json({ error: 'machineType and parameter are required' }, { status: 400 })
    }

    const telemetry = await prisma.machineTelemetry.create({
      data: {
        organizationId: session.user.currentOrganizationId,
        batchId,
        packagingLineId,
        machineType,
        machineId,
        parameter,
        value,
        unit,
        recordedAt: toUnixSeconds(recordedAt),
        notes,
      },
    })

    return NextResponse.json(telemetry, { status: 201 })
  } catch (error) {
    console.error('Failed to create telemetry', error)
    return NextResponse.json({ error: 'Failed to create telemetry' }, { status: 500 })
  }
}


