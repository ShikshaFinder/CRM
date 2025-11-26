import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/auth'
import prisma from '@/lib/prisma'

const toUnixSeconds = (value?: string | number | Date | null) => {
  if (!value) return undefined
  if (typeof value === 'number') return value
  return Math.floor(new Date(value).getTime() / 1000)
}

const nowSeconds = () => Math.floor(Date.now() / 1000)

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [lines, alerts, openBatches] = await Promise.all([
      prisma.packagingLine.findMany({
        where: { organizationId: session.user.currentOrganizationId },
        orderBy: { name: 'asc' },
        include: {
          packagingRuns: {
            include: {
              batch: {
                include: { product: true },
              },
            },
            orderBy: { startedAt: 'desc' },
            take: 5,
          },
          telemetry: {
            orderBy: { recordedAt: 'desc' },
            take: 5,
          },
        },
      }),
      prisma.processAlert.findMany({
        where: {
          organizationId: session.user.currentOrganizationId,
          packagingRunId: { not: null },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.productionBatch.findMany({
        where: {
          organizationId: session.user.currentOrganizationId,
          status: {
            in: ['IN_PRODUCTION', 'ON_HOLD', 'COMPLETED'],
          },
        },
        select: {
          id: true,
          batchNumber: true,
          status: true,
          product: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { productionDate: 'desc' },
      }),
    ])

    return NextResponse.json({ lines, alerts, openBatches })
  } catch (error) {
    console.error('Failed to fetch packaging data', error)
    return NextResponse.json({ error: 'Failed to fetch packaging data' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    if (body.entity === 'line') {
      const { name, lineType, speedUnitsPerHour, isActive = true, isUnderMaintenance = false, maintenanceNotes, lastMaintenanceAt, nextMaintenanceDue } = body
      if (!name || !lineType) {
        return NextResponse.json({ error: 'name and lineType are required' }, { status: 400 })
      }
      const line = await prisma.packagingLine.create({
        data: {
          organizationId: session.user.currentOrganizationId,
          name,
          lineType,
          speedUnitsPerHour,
          isActive: isActive ? 1 : 0,
          isUnderMaintenance: isUnderMaintenance ? 1 : 0,
          maintenanceNotes,
          lastMaintenanceAt: toUnixSeconds(lastMaintenanceAt),
          nextMaintenanceDue: toUnixSeconds(nextMaintenanceDue),
        },
      })
      return NextResponse.json(line, { status: 201 })
    }

    if (body.entity === 'run') {
      const { batchId, packagingLineId, plannedOutput, operatorId, status } = body
      if (!batchId || !packagingLineId) {
        return NextResponse.json({ error: 'batchId and packagingLineId are required' }, { status: 400 })
      }

      const line = await prisma.packagingLine.findFirst({
        where: { id: packagingLineId, organizationId: session.user.currentOrganizationId },
      })
      if (!line) {
        return NextResponse.json({ error: 'Packaging line not found' }, { status: 404 })
      }

      const batch = await prisma.productionBatch.findFirst({
        where: { id: batchId, organizationId: session.user.currentOrganizationId },
        include: { product: true },
      })
      if (!batch) {
        return NextResponse.json({ error: 'Batch not found' }, { status: 404 })
      }

      const run = await prisma.packagingRun.create({
        data: {
          organizationId: session.user.currentOrganizationId,
          batchId,
          packagingLineId,
          operatorId: operatorId ?? session.user.id,
          plannedOutput,
          status: status ?? 'PLANNED',
          startedAt: status === 'RUNNING' ? nowSeconds() : undefined,
        },
        include: {
          batch: { include: { product: true } },
          packagingLine: true,
        },
      })

      return NextResponse.json(run, { status: 201 })
    }

    return NextResponse.json({ error: 'Unknown entity type' }, { status: 400 })
  } catch (error) {
    console.error('Failed to create packaging entity', error)
    return NextResponse.json({ error: 'Failed to create packaging entity' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await req.json()
    const { runId, status, actualOutput, rejectsCount, materialUsedKg, outputs, telemetry } = body
    if (!runId) {
      return NextResponse.json({ error: 'runId is required' }, { status: 400 })
    }

    const existingRun = await prisma.packagingRun.findFirst({
      where: { id: runId, organizationId: session.user.currentOrganizationId },
      include: {
        batch: true,
      },
    })
    if (!existingRun) {
      return NextResponse.json({ error: 'Packaging run not found' }, { status: 404 })
    }

    const updateData: any = {
      status,
      actualOutput,
      rejectsCount,
      materialUsedKg,
    }
    if (status === 'RUNNING' && !existingRun.startedAt) {
      updateData.startedAt = nowSeconds()
    }
    if (status === 'COMPLETED') {
      updateData.completedAt = nowSeconds()
    }

    const run = await prisma.packagingRun.update({
      where: { id: runId },
      data: updateData,
      include: {
        batch: { include: { product: true } },
        packagingLine: true,
      },
    })

    if (Array.isArray(outputs) && outputs.length) {
      await prisma.$transaction(
        outputs.map((output: any) =>
          prisma.packagingOutput.create({
            data: {
              organizationId: session.user.currentOrganizationId,
              packagingRunId: run.id,
              productId: output.productId ?? run.batch.productId,
              packType: output.packType,
              filledUnits: output.filledUnits,
              rejectedUnits: output.rejectedUnits,
              materialUsedKg: output.materialUsedKg,
              materialBatch: output.materialBatch,
              recordedAt: toUnixSeconds(output.recordedAt) ?? nowSeconds(),
            },
          })
        )
      )
    }

    if (Array.isArray(telemetry) && telemetry.length) {
      await prisma.$transaction(
        telemetry.map((entry: any) =>
          prisma.machineTelemetry.create({
            data: {
              organizationId: session.user.currentOrganizationId,
              packagingLineId: run.packagingLineId,
              machineType: entry.machineType ?? 'PACKAGING',
              machineId: entry.machineId,
              parameter: entry.parameter ?? 'UNKNOWN',
              value: entry.value,
              unit: entry.unit,
              recordedAt: toUnixSeconds(entry.recordedAt) ?? nowSeconds(),
              notes: entry.notes,
            },
          })
        )
      )
    }

    if (status === 'COMPLETED' || typeof actualOutput === 'number' || typeof rejectsCount === 'number') {
      const stock = await prisma.inventoryStock.findFirst({
        where: {
          organizationId: session.user.currentOrganizationId,
          productId: run.batch.productId,
        },
        orderBy: { createdAt: 'desc' },
      })

      if (stock) {
        if (typeof actualOutput === 'number' && actualOutput > 0) {
          await prisma.inventoryTransaction.create({
            data: {
              organizationId: session.user.currentOrganizationId,
              stockId: stock.id,
              type: 'IN',
              qty: actualOutput,
              referenceType: 'PACKAGING_RUN',
              referenceId: run.id,
              packagingRunId: run.id,
              createdAt: nowSeconds(),
            },
          })
        }
        if (typeof rejectsCount === 'number' && rejectsCount > 0) {
          await prisma.inventoryTransaction.create({
            data: {
              organizationId: session.user.currentOrganizationId,
              stockId: stock.id,
              type: 'ADJUSTMENT',
              qty: -Math.abs(rejectsCount),
              referenceType: 'PACKAGING_REJECT',
              referenceId: run.id,
              packagingRunId: run.id,
              createdAt: nowSeconds(),
            },
          })
        }
      }
    }

    if (typeof rejectsCount === 'number' && typeof actualOutput === 'number' && actualOutput > 0) {
      const rejectRatio = rejectsCount / actualOutput
      if (rejectRatio >= 0.1) {
        await prisma.processAlert.create({
          data: {
            organizationId: session.user.currentOrganizationId,
            batchId: run.batchId,
            packagingRunId: run.id,
            alertType: 'PACKAGING_REJECTS',
            severity: rejectRatio >= 0.15 ? 'CRITICAL' : 'WARNING',
            message: `Reject ratio ${(rejectRatio * 100).toFixed(2)}% on ${run.packagingLine.name}`,
            createdAt: nowSeconds(),
          },
        })
      }
    }

    return NextResponse.json(run)
  } catch (error) {
    console.error('Failed to update packaging run', error)
    return NextResponse.json({ error: 'Failed to update packaging run' }, { status: 500 })
  }
}


