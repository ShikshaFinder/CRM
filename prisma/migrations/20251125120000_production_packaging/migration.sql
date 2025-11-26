-- Extend ProductionBatch with dairy-specific telemetry fields
ALTER TABLE "ProductionBatch" ADD COLUMN "fatBefore" REAL;
ALTER TABLE "ProductionBatch" ADD COLUMN "fatAfter" REAL;
ALTER TABLE "ProductionBatch" ADD COLUMN "snfBefore" REAL;
ALTER TABLE "ProductionBatch" ADD COLUMN "snfAfter" REAL;
ALTER TABLE "ProductionBatch" ADD COLUMN "agitationRunning" INTEGER DEFAULT 0;
ALTER TABLE "ProductionBatch" ADD COLUMN "machineRuntimeMinutes" INTEGER;
ALTER TABLE "ProductionBatch" ADD COLUMN "standardizationFormula" TEXT;
ALTER TABLE "ProductionBatch" ADD COLUMN "lossPercent" REAL;
ALTER TABLE "ProductionBatch" ADD COLUMN "temperatureProfile" TEXT;
ALTER TABLE "ProductionBatch" ADD COLUMN "holdingTimeSec" INTEGER;
ALTER TABLE "ProductionBatch" ADD COLUMN "homogenizationPressure" REAL;
ALTER TABLE "ProductionBatch" ADD COLUMN "qualityStatus" TEXT DEFAULT 'PENDING';
ALTER TABLE "ProductionBatch" ADD COLUMN "siloId" TEXT;
ALTER TABLE "ProductionBatch" ADD COLUMN "creamSeparatorId" TEXT;
ALTER TABLE "ProductionBatch" ADD COLUMN "pasteurizerId" TEXT;
ALTER TABLE "ProductionBatch" ADD COLUMN "homogenizerId" TEXT;

-- Track detailed stage logs
CREATE TABLE "ProductionStageLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "stageName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "parameters" TEXT,
    "startedAt" INTEGER,
    "completedAt" INTEGER,
    "recordedById" TEXT,
    "remarks" TEXT,
    CONSTRAINT "ProductionStageLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductionStageLog_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ProductionBatch" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductionStageLog_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Packaging infrastructure
CREATE TABLE "PackagingLine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lineType" TEXT NOT NULL,
    "speedUnitsPerHour" REAL,
    "isActive" INTEGER NOT NULL DEFAULT 1,
    "isUnderMaintenance" INTEGER NOT NULL DEFAULT 0,
    "maintenanceNotes" TEXT,
    "lastMaintenanceAt" INTEGER,
    "nextMaintenanceDue" INTEGER,
    CONSTRAINT "PackagingLine_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "PackagingRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "packagingLineId" TEXT NOT NULL,
    "operatorId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "startedAt" INTEGER,
    "completedAt" INTEGER,
    "plannedOutput" REAL,
    "actualOutput" REAL,
    "rejectsCount" REAL,
    "materialUsedKg" REAL,
    CONSTRAINT "PackagingRun_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PackagingRun_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ProductionBatch" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PackagingRun_packagingLineId_fkey" FOREIGN KEY ("packagingLineId") REFERENCES "PackagingLine" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PackagingRun_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "PackagingOutput" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "packagingRunId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "packType" TEXT,
    "filledUnits" REAL,
    "rejectedUnits" REAL,
    "materialUsedKg" REAL,
    "materialBatch" TEXT,
    "recordedAt" INTEGER,
    CONSTRAINT "PackagingOutput_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PackagingOutput_packagingRunId_fkey" FOREIGN KEY ("packagingRunId") REFERENCES "PackagingRun" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PackagingOutput_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Process alerts covering production + packaging deviations
CREATE TABLE "ProcessAlert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "alertType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "acknowledged" INTEGER NOT NULL DEFAULT 0,
    "acknowledgedAt" INTEGER,
    "batchId" TEXT,
    "stageLogId" TEXT,
    "packagingRunId" TEXT,
    CONSTRAINT "ProcessAlert_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProcessAlert_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ProductionBatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProcessAlert_stageLogId_fkey" FOREIGN KEY ("stageLogId") REFERENCES "ProductionStageLog" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProcessAlert_packagingRunId_fkey" FOREIGN KEY ("packagingRunId") REFERENCES "PackagingRun" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Machine telemetry for maintenance insights
CREATE TABLE "MachineTelemetry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "batchId" TEXT,
    "packagingLineId" TEXT,
    "machineType" TEXT NOT NULL,
    "machineId" TEXT,
    "parameter" TEXT NOT NULL,
    "value" REAL,
    "unit" TEXT,
    "recordedAt" INTEGER NOT NULL,
    "notes" TEXT,
    CONSTRAINT "MachineTelemetry_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MachineTelemetry_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ProductionBatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "MachineTelemetry_packagingLineId_fkey" FOREIGN KEY ("packagingLineId") REFERENCES "PackagingLine" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Link inventory transactions to packaging runs when applicable
ALTER TABLE "InventoryTransaction" ADD COLUMN "packagingRunId" TEXT REFERENCES "PackagingRun" ("id") ON DELETE SET NULL ON UPDATE CASCADE;


