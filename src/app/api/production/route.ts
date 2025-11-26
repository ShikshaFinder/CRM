import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '../../../lib/auth'
import prisma from '../../../lib/prisma'

const STAGE_TEMPLATES = [
  'MILK_ARRIVAL',
  'PLATFORM_TEST',
  'CREAM_SEPARATION',
  'STANDARDIZATION',
  'PASTEURIZATION',
  'HOMOGENIZATION',
  'PRODUCT_MANUFACTURING',
  'PACKAGING_HANDOFF',
]

const toUnixSeconds = (value?: string | number | Date | null) => {
  if (!value) return undefined
  if (typeof value === 'number') return value
  return Math.floor(new Date(value).getTime() / 1000)
}

const serializeProfile = (profile?: unknown) => {
  if (!profile) return undefined
  if (typeof profile === 'string') return profile
  try {
    return JSON.stringify(profile)
  } catch {
    return undefined
  }
}

const buildAlert = (
  organizationId: string,
  batchId: string,
  alertType: string,
  severity: 'INFO' | 'WARNING' | 'CRITICAL',
  message: string,
  stageLogId?: string
) => ({
  organizationId,
  batchId,
  alertType,
  severity,
  message,
  createdAt: Math.floor(Date.now() / 1000),
  stageLogId,
})

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const statusFilter = url.searchParams.get('status')
    const query = url.searchParams.get('q')

    const batches = await prisma.productionBatch.findMany({
      where: {
        organizationId: session.user.currentOrganizationId,
        status: statusFilter || undefined,
        batchNumber: query
          ? {
              contains: query,
              mode: 'insensitive',
            }
          : undefined,
      },
      include: {
        product: true,
        items: true,
        inventoryStocks: true,
        stageLogs: {
          orderBy: { startedAt: 'asc' },
        },
        packagingRuns: {
          include: {
            packagingLine: true,
          },
          orderBy: { startedAt: 'desc' },
        },
        alerts: {
          orderBy: { createdAt: 'desc' },
        },
      },
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
    const {
      batchNumber,
      productId,
      producedQty,
      productionDate,
      manufacturingDate,
      expiryDate,
      status,
      items,
      fatBefore,
      fatAfter,
      snfBefore,
      snfAfter,
      agitationRunning,
      machineRuntimeMinutes,
      standardizationFormula,
      lossPercent,
      temperatureProfile,
      holdingTimeSec,
      homogenizationPressure,
      qualityStatus,
      siloId,
      creamSeparatorId,
      pasteurizerId,
      homogenizerId,
      stageSeeds,
      telemetryNotes,
    } = body

    if (!batchNumber || !productId) {
      return NextResponse.json(
        { error: 'batchNumber and productId are required' },
        { status: 400 }
      )
    }

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

    const parsedProductionDate = toUnixSeconds(productionDate) ?? Math.floor(Date.now() / 1000)
    const parsedManufacturingDate = toUnixSeconds(manufacturingDate)
    const parsedExpiryDate = toUnixSeconds(expiryDate)

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
        fatBefore,
        fatAfter,
        snfBefore,
        snfAfter,
        agitationRunning: typeof agitationRunning === 'boolean' ? (agitationRunning ? 1 : 0) : agitationRunning,
        machineRuntimeMinutes,
        standardizationFormula,
        lossPercent,
        temperatureProfile: serializeProfile(temperatureProfile),
        holdingTimeSec,
        homogenizationPressure,
        qualityStatus,
        siloId,
        creamSeparatorId,
        pasteurizerId,
        homogenizerId,
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

    const stagePayload = Array.isArray(stageSeeds) && stageSeeds.length
      ? stageSeeds
      : STAGE_TEMPLATES.map((stage, idx) => ({
          stageName: stage,
          status: idx === 0 ? 'COMPLETED' : 'PENDING',
          startedAt: idx === 0 ? parsedProductionDate : null,
          completedAt: idx === 0 ? parsedProductionDate : null,
          parameters: idx === 0 ? JSON.stringify({ fatBefore, snfBefore }) : null,
        }))

    await prisma.$transaction(
      stagePayload.map((stage: any) =>
        prisma.productionStageLog.create({
          data: {
            organizationId: session.user.currentOrganizationId,
            batchId: batch.id,
            stageName: stage.stageName,
            status: stage.status ?? 'PENDING',
            startedAt: toUnixSeconds(stage.startedAt),
            completedAt: toUnixSeconds(stage.completedAt),
            parameters: serializeProfile(stage.parameters),
            recordedById: session.user.id,
            remarks: stage.remarks,
          },
        })
      )
    )

    const alerts = []
    if (typeof lossPercent === 'number' && lossPercent > 3) {
      alerts.push(
        buildAlert(
          session.user.currentOrganizationId,
          batch.id,
          'YIELD_LOSS',
          lossPercent > 5 ? 'CRITICAL' : 'WARNING',
          `Loss percent is ${lossPercent.toFixed(2)}%`,
        )
      )
    }
    if (typeof holdingTimeSec === 'number' && holdingTimeSec < 12) {
      alerts.push(
        buildAlert(
          session.user.currentOrganizationId,
          batch.id,
          'PASTEURIZATION',
          'CRITICAL',
          `Holding time below threshold (${holdingTimeSec}s)`,
        )
      )
    }
    if (typeof homogenizationPressure === 'number' && homogenizationPressure < 1500) {
      alerts.push(
        buildAlert(
          session.user.currentOrganizationId,
          batch.id,
          'HOMOGENIZATION',
          'WARNING',
          `Low homogenization pressure (${homogenizationPressure} psi)`,
        )
      )
    }

    if (alerts.length) {
      await prisma.$transaction(
        alerts.map((alert) =>
          prisma.processAlert.create({
            data: alert,
          })
        )
      )
    }

    if (typeof machineRuntimeMinutes === 'number') {
      await prisma.machineTelemetry.create({
        data: {
          organizationId: session.user.currentOrganizationId,
          batchId: batch.id,
          machineType: 'CHILLER',
          machineId: pasteurizerId ?? 'CHILLER-1',
          parameter: 'RUNTIME_MINUTES',
          value: machineRuntimeMinutes,
          unit: 'MIN',
          recordedAt: parsedProductionDate,
          notes: telemetryNotes,
        },
      })
    }

    if (typeof agitationRunning === 'boolean') {
      await prisma.machineTelemetry.create({
        data: {
          organizationId: session.user.currentOrganizationId,
          batchId: batch.id,
          machineType: 'SILO',
          machineId: siloId ?? 'SILO-1',
          parameter: 'AGITATION_STATE',
          value: agitationRunning ? 1 : 0,
          unit: 'BOOLEAN',
          recordedAt: parsedProductionDate,
          notes: telemetryNotes ?? 'Agitation status captured during chilling',
        },
      })
    }

    return NextResponse.json(batch, { status: 201 })
  } catch (error) {
    console.error('Failed to create production batch', error)
    return NextResponse.json(
      { error: 'Failed to create production batch' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await req.json()
    const {
      batchId,
      status,
      qualityStatus,
      producedQty,
      lossPercent,
      temperatureProfile,
      holdingTimeSec,
      homogenizationPressure,
      stageUpdate,
      telemetry,
    } = body

    if (!batchId) {
      return NextResponse.json({ error: 'batchId is required' }, { status: 400 })
    }

    const batch = await prisma.productionBatch.findFirst({
      where: { id: batchId, organizationId: session.user.currentOrganizationId },
    })

    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 })
    }

    const updatedBatch = await prisma.productionBatch.update({
      where: { id: batch.id },
      data: {
        status,
        qualityStatus,
        producedQty,
        lossPercent,
        temperatureProfile: serializeProfile(temperatureProfile),
        holdingTimeSec,
        homogenizationPressure,
      },
      include: {
        product: true,
        items: true,
        stageLogs: true,
      },
    })

    if (stageUpdate?.stageName) {
      const log = await prisma.productionStageLog.create({
        data: {
          organizationId: session.user.currentOrganizationId,
          batchId: batch.id,
          stageName: stageUpdate.stageName,
          status: stageUpdate.status ?? 'IN_PROGRESS',
          startedAt: toUnixSeconds(stageUpdate.startedAt) ?? Math.floor(Date.now() / 1000),
          completedAt: toUnixSeconds(stageUpdate.completedAt),
          recordedById: session.user.id,
          remarks: stageUpdate.remarks,
          parameters: serializeProfile(stageUpdate.parameters),
        },
      })

      if (stageUpdate.status === 'FAIL') {
        await prisma.processAlert.create({
          data: buildAlert(
            session.user.currentOrganizationId,
            batch.id,
            `${stageUpdate.stageName}_FAIL`,
            'CRITICAL',
            stageUpdate.remarks || `${stageUpdate.stageName} marked as FAIL`,
            log.id
          ),
        })
      }
    }

    if (telemetry?.length) {
      await prisma.$transaction(
        telemetry.map((entry: any) =>
          prisma.machineTelemetry.create({
            data: {
              organizationId: session.user.currentOrganizationId,
              batchId: batch.id,
              machineType: entry.machineType ?? 'GENERIC',
              machineId: entry.machineId,
              parameter: entry.parameter ?? 'UNKNOWN',
              value: entry.value,
              unit: entry.unit,
              recordedAt: toUnixSeconds(entry.recordedAt) ?? Math.floor(Date.now() / 1000),
              notes: entry.notes,
            },
          })
        )
      )
    }

    return NextResponse.json(updatedBatch)
  } catch (error) {
    console.error('Failed to update production batch', error)
    return NextResponse.json(
      { error: 'Failed to update production batch' },
      { status: 500 }
    )
  }
}
