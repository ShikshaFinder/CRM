/*
  Warnings:

  - Added the required column `organizationId` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Commission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `CommissionRule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Connection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `DeliveryChallan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `InventoryStock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `InventoryTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `MilkCollectionCenter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `MilkProcurementEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `MilkRateChart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `ProductionBatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `QualityTest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `SalesInquiry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `SalesOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `SalesTarget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `StorageLocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `SupplierFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `SupportTicket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    CONSTRAINT "Organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrganizationMembership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    CONSTRAINT "OrganizationMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrganizationMembership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MagicLinkToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MagicLinkToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrganizationInvite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "expiresAt" DATETIME NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    CONSTRAINT "OrganizationInvite_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrganizationInvite_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Drop existing data (as per plan: acceptable to drop existing data)
DELETE FROM "Activity";
DELETE FROM "AuditLog";
DELETE FROM "Bill";
DELETE FROM "Commission";
DELETE FROM "CommissionRule";
DELETE FROM "Connection";
DELETE FROM "DeliveryChallan";
DELETE FROM "Document";
DELETE FROM "InventoryStock";
DELETE FROM "InventoryTransaction";
DELETE FROM "Invoice";
DELETE FROM "MilkCollectionCenter";
DELETE FROM "MilkProcurementEntry";
DELETE FROM "MilkRateChart";
DELETE FROM "Notification";
DELETE FROM "OrderItem";
DELETE FROM "Payment";
DELETE FROM "Product";
DELETE FROM "ProductionBatch";
DELETE FROM "PurchaseOrder";
DELETE FROM "QualityTest";
DELETE FROM "Quotation";
DELETE FROM "SalesInquiry";
DELETE FROM "SalesOrder";
DELETE FROM "SalesTarget";
DELETE FROM "StorageLocation";
DELETE FROM "SupplierFeedback";
DELETE FROM "SupportTicket";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "notes" TEXT,
    "relatedType" TEXT,
    "relatedId" TEXT,
    "createdAt" INTEGER NOT NULL,
    CONSTRAINT "Activity_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
DROP TABLE "Activity";
ALTER TABLE "new_Activity" RENAME TO "Activity";
CREATE TABLE "new_AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "meta" TEXT,
    "createdAt" INTEGER NOT NULL,
    CONSTRAINT "AuditLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
DROP TABLE "AuditLog";
ALTER TABLE "new_AuditLog" RENAME TO "AuditLog";
CREATE TABLE "new_Bill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "billNumber" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "dueDate" INTEGER,
    "amount" REAL NOT NULL,
    "paidAmount" REAL NOT NULL DEFAULT 0,
    "status" TEXT,
    CONSTRAINT "Bill_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Bill_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Connection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
DROP TABLE "Bill";
ALTER TABLE "new_Bill" RENAME TO "Bill";
CREATE UNIQUE INDEX "Bill_billNumber_key" ON "Bill"("billNumber");
CREATE TABLE "new_Commission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "orderId" TEXT,
    "amount" REAL NOT NULL,
    "paidStatus" TEXT,
    CONSTRAINT "Commission_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Commission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
DROP TABLE "Commission";
ALTER TABLE "new_Commission" RENAME TO "Commission";
CREATE TABLE "new_CommissionRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "productCategory" TEXT,
    "minAmount" REAL,
    "maxAmount" REAL,
    "percentage" REAL NOT NULL,
    CONSTRAINT "CommissionRule_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
DROP TABLE "CommissionRule";
ALTER TABLE "new_CommissionRule" RENAME TO "CommissionRule";
CREATE TABLE "new_Connection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "businessCategory" TEXT NOT NULL,
    "primaryContactId" TEXT,
    "gstNumber" TEXT,
    "creditLimit" REAL DEFAULT 0,
    "paymentTermsDays" INTEGER DEFAULT 0,
    "hasColdStorage" INTEGER DEFAULT 0,
    "deliveryPreferences" TEXT,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    CONSTRAINT "Connection_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
DROP TABLE "Connection";
ALTER TABLE "new_Connection" RENAME TO "Connection";
CREATE TABLE "new_DeliveryChallan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "challanNumber" TEXT NOT NULL,
    "salesOrderId" TEXT,
    "vehicleNumber" TEXT,
    "driverName" TEXT,
    "driverPhone" TEXT,
    "tempInitialC" REAL,
    "tempFinalC" REAL,
    "signedBy" TEXT,
    "deliveredAt" INTEGER,
    CONSTRAINT "DeliveryChallan_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DeliveryChallan" ("challanNumber", "deliveredAt", "driverName", "driverPhone", "id", "salesOrderId", "signedBy", "tempFinalC", "tempInitialC", "vehicleNumber") SELECT "challanNumber", "deliveredAt", "driverName", "driverPhone", "id", "salesOrderId", "signedBy", "tempFinalC", "tempInitialC", "vehicleNumber" FROM "DeliveryChallan";
DROP TABLE "DeliveryChallan";
ALTER TABLE "new_DeliveryChallan" RENAME TO "DeliveryChallan";
CREATE UNIQUE INDEX "DeliveryChallan_challanNumber_key" ON "DeliveryChallan"("challanNumber");
CREATE TABLE "new_Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "category" TEXT,
    "relatedType" TEXT,
    "relatedId" TEXT,
    "uploadedById" TEXT,
    "uploadedAt" INTEGER NOT NULL,
    CONSTRAINT "Document_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Document_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Document" ("category", "id", "name", "path", "relatedId", "relatedType", "uploadedAt", "uploadedById") SELECT "category", "id", "name", "path", "relatedId", "relatedType", "uploadedAt", "uploadedById" FROM "Document";
DROP TABLE "Document";
ALTER TABLE "new_Document" RENAME TO "Document";
CREATE TABLE "new_InventoryStock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "batchId" TEXT,
    "storageLocationId" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "mfgDate" INTEGER,
    "expiryDate" INTEGER,
    "createdAt" INTEGER NOT NULL,
    CONSTRAINT "InventoryStock_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InventoryStock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InventoryStock_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ProductionBatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InventoryStock_storageLocationId_fkey" FOREIGN KEY ("storageLocationId") REFERENCES "StorageLocation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_InventoryStock" ("batchId", "createdAt", "expiryDate", "id", "mfgDate", "productId", "quantity", "storageLocationId") SELECT "batchId", "createdAt", "expiryDate", "id", "mfgDate", "productId", "quantity", "storageLocationId" FROM "InventoryStock";
DROP TABLE "InventoryStock";
ALTER TABLE "new_InventoryStock" RENAME TO "InventoryStock";
CREATE TABLE "new_InventoryTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "qty" REAL NOT NULL,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "createdAt" INTEGER NOT NULL,
    CONSTRAINT "InventoryTransaction_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InventoryTransaction_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "InventoryStock" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_InventoryTransaction" ("createdAt", "id", "qty", "referenceId", "referenceType", "stockId", "type") SELECT "createdAt", "id", "qty", "referenceId", "referenceType", "stockId", "type" FROM "InventoryTransaction";
DROP TABLE "InventoryTransaction";
ALTER TABLE "new_InventoryTransaction" RENAME TO "InventoryTransaction";
CREATE TABLE "new_Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "salesOrderId" TEXT,
    "dueDate" INTEGER,
    "totalAmount" REAL NOT NULL,
    "paidAmount" REAL NOT NULL DEFAULT 0,
    "status" TEXT,
    "createdAt" INTEGER NOT NULL,
    CONSTRAINT "Invoice_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Invoice_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES "SalesOrder" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("createdAt", "dueDate", "id", "invoiceNumber", "paidAmount", "salesOrderId", "status", "totalAmount") SELECT "createdAt", "dueDate", "id", "invoiceNumber", "paidAmount", "salesOrderId", "status", "totalAmount" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");
CREATE TABLE "new_MilkCollectionCenter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "dailyCapacityL" REAL DEFAULT 0,
    "bmrAvailable" INTEGER DEFAULT 0,
    "hasTestingEquip" INTEGER DEFAULT 0,
    CONSTRAINT "MilkCollectionCenter_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MilkCollectionCenter" ("bmrAvailable", "dailyCapacityL", "hasTestingEquip", "id", "latitude", "longitude", "name") SELECT "bmrAvailable", "dailyCapacityL", "hasTestingEquip", "id", "latitude", "longitude", "name" FROM "MilkCollectionCenter";
DROP TABLE "MilkCollectionCenter";
ALTER TABLE "new_MilkCollectionCenter" RENAME TO "MilkCollectionCenter";
CREATE TABLE "new_MilkProcurementEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "collectionCenterId" TEXT,
    "datetime" INTEGER NOT NULL,
    "quantityL" REAL NOT NULL,
    "fatPercent" REAL,
    "snfPercent" REAL,
    "clrReading" REAL,
    "temperatureC" REAL,
    "qualityGrade" TEXT NOT NULL,
    "ratePerLitre" REAL NOT NULL,
    "totalAmount" REAL NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "milkType" TEXT,
    "createdAt" INTEGER NOT NULL,
    CONSTRAINT "MilkProcurementEntry_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MilkProcurementEntry_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Connection" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MilkProcurementEntry_collectionCenterId_fkey" FOREIGN KEY ("collectionCenterId") REFERENCES "MilkCollectionCenter" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_MilkProcurementEntry" ("clrReading", "collectionCenterId", "createdAt", "datetime", "fatPercent", "id", "milkType", "paymentStatus", "qualityGrade", "quantityL", "ratePerLitre", "snfPercent", "supplierId", "temperatureC", "totalAmount") SELECT "clrReading", "collectionCenterId", "createdAt", "datetime", "fatPercent", "id", "milkType", "paymentStatus", "qualityGrade", "quantityL", "ratePerLitre", "snfPercent", "supplierId", "temperatureC", "totalAmount" FROM "MilkProcurementEntry";
DROP TABLE "MilkProcurementEntry";
ALTER TABLE "new_MilkProcurementEntry" RENAME TO "MilkProcurementEntry";
CREATE TABLE "new_MilkRateChart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "fatPercentMin" REAL NOT NULL,
    "fatPercentMax" REAL NOT NULL,
    "snfPercentMin" REAL NOT NULL,
    "snfPercentMax" REAL NOT NULL,
    "milkType" TEXT NOT NULL,
    "qualityGrade" TEXT NOT NULL,
    "ratePerLitre" REAL NOT NULL,
    "effectiveFrom" INTEGER NOT NULL,
    "effectiveTo" INTEGER,
    CONSTRAINT "MilkRateChart_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MilkRateChart" ("effectiveFrom", "effectiveTo", "fatPercentMax", "fatPercentMin", "id", "milkType", "qualityGrade", "ratePerLitre", "snfPercentMax", "snfPercentMin") SELECT "effectiveFrom", "effectiveTo", "fatPercentMax", "fatPercentMin", "id", "milkType", "qualityGrade", "ratePerLitre", "snfPercentMax", "snfPercentMin" FROM "MilkRateChart";
DROP TABLE "MilkRateChart";
ALTER TABLE "new_MilkRateChart" RENAME TO "MilkRateChart";
CREATE TABLE "new_Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "isRead" INTEGER NOT NULL DEFAULT 0,
    "createdAt" INTEGER NOT NULL,
    CONSTRAINT "Notification_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Notification" ("body", "createdAt", "id", "isRead", "title", "userId") SELECT "body", "createdAt", "id", "isRead", "title", "userId" FROM "Notification";
DROP TABLE "Notification";
ALTER TABLE "new_Notification" RENAME TO "Notification";
CREATE TABLE "new_OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "salesOrderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "qty" REAL NOT NULL,
    "price" REAL NOT NULL,
    "batchId" TEXT,
    "mfgDate" INTEGER,
    "expiryDate" INTEGER,
    CONSTRAINT "OrderItem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES "SalesOrder" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ProductionBatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_OrderItem" ("batchId", "expiryDate", "id", "mfgDate", "price", "productId", "qty", "salesOrderId") SELECT "batchId", "expiryDate", "id", "mfgDate", "price", "productId", "qty", "salesOrderId" FROM "OrderItem";
DROP TABLE "OrderItem";
ALTER TABLE "new_OrderItem" RENAME TO "OrderItem";
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "amount" REAL NOT NULL,
    "method" TEXT NOT NULL,
    "referenceNo" TEXT,
    "bankName" TEXT,
    "paidAt" INTEGER NOT NULL,
    "status" TEXT,
    CONSTRAINT "Payment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("amount", "bankName", "id", "invoiceId", "method", "paidAt", "referenceNo", "status") SELECT "amount", "bankName", "id", "invoiceId", "method", "paidAt", "referenceNo", "status" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "sku" TEXT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subCategory" TEXT,
    "description" TEXT,
    "unit" TEXT NOT NULL,
    "packSize" TEXT,
    "minFatPercent" REAL,
    "minSnfPercent" REAL,
    "shelfLifeDays" INTEGER,
    "storageTempMin" REAL,
    "storageTempMax" REAL,
    "requiresColdChain" INTEGER NOT NULL DEFAULT 0,
    "unitPrice" REAL,
    "costPrice" REAL,
    "currentStock" REAL DEFAULT 0,
    "reorderLevel" REAL DEFAULT 0,
    "minOrderQuantity" REAL DEFAULT 0,
    CONSTRAINT "Product_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("category", "costPrice", "currentStock", "description", "id", "minFatPercent", "minOrderQuantity", "minSnfPercent", "name", "packSize", "reorderLevel", "requiresColdChain", "shelfLifeDays", "sku", "storageTempMax", "storageTempMin", "subCategory", "unit", "unitPrice") SELECT "category", "costPrice", "currentStock", "description", "id", "minFatPercent", "minOrderQuantity", "minSnfPercent", "name", "packSize", "reorderLevel", "requiresColdChain", "shelfLifeDays", "sku", "storageTempMax", "storageTempMin", "subCategory", "unit", "unitPrice" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
CREATE TABLE "new_ProductionBatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "producedQty" REAL NOT NULL,
    "productionDate" INTEGER NOT NULL,
    "manufacturingDate" INTEGER,
    "expiryDate" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'IN_PRODUCTION',
    CONSTRAINT "ProductionBatch_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductionBatch_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductionBatch" ("batchNumber", "expiryDate", "id", "manufacturingDate", "producedQty", "productId", "productionDate", "status") SELECT "batchNumber", "expiryDate", "id", "manufacturingDate", "producedQty", "productId", "productionDate", "status" FROM "ProductionBatch";
DROP TABLE "ProductionBatch";
ALTER TABLE "new_ProductionBatch" RENAME TO "ProductionBatch";
CREATE UNIQUE INDEX "ProductionBatch_batchNumber_key" ON "ProductionBatch"("batchNumber");
CREATE TABLE "new_PurchaseOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "poRef" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "expectedDate" INTEGER,
    "actualDate" INTEGER,
    "createdAt" INTEGER NOT NULL,
    CONSTRAINT "PurchaseOrder_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Connection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PurchaseOrder" ("actualDate", "createdAt", "expectedDate", "id", "poRef", "supplierId", "type") SELECT "actualDate", "createdAt", "expectedDate", "id", "poRef", "supplierId", "type" FROM "PurchaseOrder";
DROP TABLE "PurchaseOrder";
ALTER TABLE "new_PurchaseOrder" RENAME TO "PurchaseOrder";
CREATE UNIQUE INDEX "PurchaseOrder_poRef_key" ON "PurchaseOrder"("poRef");
CREATE TABLE "new_QualityTest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "testDate" INTEGER NOT NULL,
    "testedById" TEXT,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "parameters" TEXT,
    "outcome" TEXT NOT NULL,
    "remarks" TEXT,
    CONSTRAINT "QualityTest_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QualityTest_testedById_fkey" FOREIGN KEY ("testedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_QualityTest" ("id", "outcome", "parameters", "remarks", "targetId", "targetType", "testDate", "testedById") SELECT "id", "outcome", "parameters", "remarks", "targetId", "targetType", "testDate", "testedById" FROM "QualityTest";
DROP TABLE "QualityTest";
ALTER TABLE "new_QualityTest" RENAME TO "QualityTest";
CREATE TABLE "new_Quotation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "quoteRef" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "subtotal" REAL NOT NULL,
    "gstCGST" REAL,
    "gstSGST" REAL,
    "gstIGST" REAL,
    "discount" REAL,
    "transportCharges" REAL,
    "coldChainCharges" REAL,
    "deliveryTerms" TEXT,
    "paymentTerms" TEXT,
    "status" TEXT,
    "createdAt" INTEGER NOT NULL,
    CONSTRAINT "Quotation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Quotation_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "Connection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Quotation" ("coldChainCharges", "connectionId", "createdAt", "deliveryTerms", "discount", "gstCGST", "gstIGST", "gstSGST", "id", "paymentTerms", "quoteRef", "status", "subtotal", "transportCharges") SELECT "coldChainCharges", "connectionId", "createdAt", "deliveryTerms", "discount", "gstCGST", "gstIGST", "gstSGST", "id", "paymentTerms", "quoteRef", "status", "subtotal", "transportCharges" FROM "Quotation";
DROP TABLE "Quotation";
ALTER TABLE "new_Quotation" RENAME TO "Quotation";
CREATE UNIQUE INDEX "Quotation_quoteRef_key" ON "Quotation"("quoteRef");
CREATE TABLE "new_SalesInquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "inquiryNumber" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "productId" TEXT,
    "quantity" REAL,
    "quotedPrice" REAL,
    "status" TEXT,
    "source" TEXT,
    "createdAt" INTEGER NOT NULL,
    CONSTRAINT "SalesInquiry_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SalesInquiry_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "Connection" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SalesInquiry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SalesInquiry" ("connectionId", "createdAt", "id", "inquiryNumber", "productId", "quantity", "quotedPrice", "source", "status") SELECT "connectionId", "createdAt", "id", "inquiryNumber", "productId", "quantity", "quotedPrice", "source", "status" FROM "SalesInquiry";
DROP TABLE "SalesInquiry";
ALTER TABLE "new_SalesInquiry" RENAME TO "SalesInquiry";
CREATE UNIQUE INDEX "SalesInquiry_inquiryNumber_key" ON "SalesInquiry"("inquiryNumber");
CREATE TABLE "new_SalesOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "orderRef" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "stage" TEXT,
    "deliveryAddress" TEXT,
    "distanceKm" REAL,
    "vehicleReq" TEXT,
    "createdAt" INTEGER NOT NULL,
    CONSTRAINT "SalesOrder_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SalesOrder_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "Connection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SalesOrder" ("connectionId", "createdAt", "deliveryAddress", "distanceKm", "id", "orderRef", "stage", "vehicleReq") SELECT "connectionId", "createdAt", "deliveryAddress", "distanceKm", "id", "orderRef", "stage", "vehicleReq" FROM "SalesOrder";
DROP TABLE "SalesOrder";
ALTER TABLE "new_SalesOrder" RENAME TO "SalesOrder";
CREATE UNIQUE INDEX "SalesOrder_orderRef_key" ON "SalesOrder"("orderRef");
CREATE TABLE "new_SalesTarget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "period" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "achieved" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "SalesTarget_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SalesTarget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SalesTarget" ("achieved", "amount", "id", "period", "userId") SELECT "achieved", "amount", "id", "period", "userId" FROM "SalesTarget";
DROP TABLE "SalesTarget";
ALTER TABLE "new_SalesTarget" RENAME TO "SalesTarget";
CREATE TABLE "new_StorageLocation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "capacity" REAL,
    "currentLoad" REAL DEFAULT 0,
    "tempMin" REAL,
    "tempMax" REAL,
    "currentTemp" REAL,
    "operational" INTEGER DEFAULT 1,
    "maintenanceLog" TEXT,
    CONSTRAINT "StorageLocation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_StorageLocation" ("capacity", "currentLoad", "currentTemp", "id", "maintenanceLog", "name", "operational", "tempMax", "tempMin", "type") SELECT "capacity", "currentLoad", "currentTemp", "id", "maintenanceLog", "name", "operational", "tempMax", "tempMin", "type" FROM "StorageLocation";
DROP TABLE "StorageLocation";
ALTER TABLE "new_StorageLocation" RENAME TO "StorageLocation";
CREATE TABLE "new_SupplierFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "feedbackType" TEXT NOT NULL,
    "details" TEXT,
    "resolved" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SupplierFeedback_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SupplierFeedback_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Connection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SupplierFeedback" ("details", "feedbackType", "id", "resolved", "supplierId") SELECT "details", "feedbackType", "id", "resolved", "supplierId" FROM "SupplierFeedback";
DROP TABLE "SupplierFeedback";
ALTER TABLE "new_SupplierFeedback" RENAME TO "SupplierFeedback";
CREATE TABLE "new_SupportTicket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "connectionId" TEXT,
    "issueType" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    CONSTRAINT "SupportTicket_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SupportTicket_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "Connection" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SupportTicket" ("connectionId", "createdAt", "id", "issueType", "priority", "status", "ticketNumber") SELECT "connectionId", "createdAt", "id", "issueType", "priority", "status", "ticketNumber" FROM "SupportTicket";
DROP TABLE "SupportTicket";
ALTER TABLE "new_SupportTicket" RENAME TO "SupportTicket";
CREATE UNIQUE INDEX "SupportTicket_ticketNumber_key" ON "SupportTicket"("ticketNumber");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" INTEGER NOT NULL DEFAULT 1,
    "emailVerified" INTEGER NOT NULL DEFAULT 0,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    "lastLoginAt" INTEGER,
    "defaultOrganizationId" TEXT,
    "departmentId" TEXT,
    "managerId" TEXT,
    CONSTRAINT "User_defaultOrganizationId_fkey" FOREIGN KEY ("defaultOrganizationId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "departmentId", "email", "emailVerified", "id", "isActive", "lastLoginAt", "managerId", "password", "updatedAt") SELECT "createdAt", "departmentId", "email", "emailVerified", "id", "isActive", "lastLoginAt", "managerId", "password", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMembership_userId_organizationId_key" ON "OrganizationMembership"("userId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "MagicLinkToken_token_key" ON "MagicLinkToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationInvite_token_key" ON "OrganizationInvite"("token");
