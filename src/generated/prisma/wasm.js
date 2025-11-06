
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/wasm.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  isActive: 'isActive',
  emailVerified: 'emailVerified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lastLoginAt: 'lastLoginAt',
  departmentId: 'departmentId',
  managerId: 'managerId'
};

exports.Prisma.UserProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  fullName: 'fullName',
  phone: 'phone',
  address: 'address',
  city: 'city',
  state: 'state',
  postalCode: 'postalCode',
  country: 'country',
  roleTitle: 'roleTitle'
};

exports.Prisma.RoleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  desc: 'desc'
};

exports.Prisma.UserRoleScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  roleId: 'roleId'
};

exports.Prisma.DepartmentScalarFieldEnum = {
  id: 'id',
  name: 'name',
  desc: 'desc'
};

exports.Prisma.ConnectionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  businessCategory: 'businessCategory',
  primaryContactId: 'primaryContactId',
  gstNumber: 'gstNumber',
  creditLimit: 'creditLimit',
  paymentTermsDays: 'paymentTermsDays',
  hasColdStorage: 'hasColdStorage',
  deliveryPreferences: 'deliveryPreferences',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ContactPersonScalarFieldEnum = {
  id: 'id',
  connectionId: 'connectionId',
  fullName: 'fullName',
  email: 'email',
  phone: 'phone',
  isPrimary: 'isPrimary'
};

exports.Prisma.FSSAILicenseScalarFieldEnum = {
  id: 'id',
  connectionId: 'connectionId',
  licenseNumber: 'licenseNumber',
  issueDate: 'issueDate',
  expiryDate: 'expiryDate'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  sku: 'sku',
  name: 'name',
  category: 'category',
  subCategory: 'subCategory',
  description: 'description',
  unit: 'unit',
  packSize: 'packSize',
  minFatPercent: 'minFatPercent',
  minSnfPercent: 'minSnfPercent',
  shelfLifeDays: 'shelfLifeDays',
  storageTempMin: 'storageTempMin',
  storageTempMax: 'storageTempMax',
  requiresColdChain: 'requiresColdChain',
  unitPrice: 'unitPrice',
  costPrice: 'costPrice',
  currentStock: 'currentStock',
  reorderLevel: 'reorderLevel',
  minOrderQuantity: 'minOrderQuantity'
};

exports.Prisma.ProductPriceHistoryScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  unitPrice: 'unitPrice',
  costPrice: 'costPrice',
  startDate: 'startDate',
  endDate: 'endDate'
};

exports.Prisma.MilkCollectionCenterScalarFieldEnum = {
  id: 'id',
  name: 'name',
  latitude: 'latitude',
  longitude: 'longitude',
  dailyCapacityL: 'dailyCapacityL',
  bmrAvailable: 'bmrAvailable',
  hasTestingEquip: 'hasTestingEquip'
};

exports.Prisma.MilkProcurementEntryScalarFieldEnum = {
  id: 'id',
  supplierId: 'supplierId',
  collectionCenterId: 'collectionCenterId',
  datetime: 'datetime',
  quantityL: 'quantityL',
  fatPercent: 'fatPercent',
  snfPercent: 'snfPercent',
  clrReading: 'clrReading',
  temperatureC: 'temperatureC',
  qualityGrade: 'qualityGrade',
  ratePerLitre: 'ratePerLitre',
  totalAmount: 'totalAmount',
  paymentStatus: 'paymentStatus',
  milkType: 'milkType',
  createdAt: 'createdAt'
};

exports.Prisma.MilkRateChartScalarFieldEnum = {
  id: 'id',
  fatPercentMin: 'fatPercentMin',
  fatPercentMax: 'fatPercentMax',
  snfPercentMin: 'snfPercentMin',
  snfPercentMax: 'snfPercentMax',
  milkType: 'milkType',
  qualityGrade: 'qualityGrade',
  ratePerLitre: 'ratePerLitre',
  effectiveFrom: 'effectiveFrom',
  effectiveTo: 'effectiveTo'
};

exports.Prisma.ProductionBatchScalarFieldEnum = {
  id: 'id',
  batchNumber: 'batchNumber',
  productId: 'productId',
  producedQty: 'producedQty',
  productionDate: 'productionDate',
  manufacturingDate: 'manufacturingDate',
  expiryDate: 'expiryDate',
  status: 'status'
};

exports.Prisma.ProductionBatchItemScalarFieldEnum = {
  id: 'id',
  batchId: 'batchId',
  productId: 'productId',
  rawMilkUsedL: 'rawMilkUsedL',
  quantity: 'quantity'
};

exports.Prisma.QualityTestScalarFieldEnum = {
  id: 'id',
  testDate: 'testDate',
  testedById: 'testedById',
  targetType: 'targetType',
  targetId: 'targetId',
  parameters: 'parameters',
  outcome: 'outcome',
  remarks: 'remarks'
};

exports.Prisma.SalesInquiryScalarFieldEnum = {
  id: 'id',
  inquiryNumber: 'inquiryNumber',
  connectionId: 'connectionId',
  productId: 'productId',
  quantity: 'quantity',
  quotedPrice: 'quotedPrice',
  status: 'status',
  source: 'source',
  createdAt: 'createdAt'
};

exports.Prisma.QuotationScalarFieldEnum = {
  id: 'id',
  quoteRef: 'quoteRef',
  connectionId: 'connectionId',
  subtotal: 'subtotal',
  gstCGST: 'gstCGST',
  gstSGST: 'gstSGST',
  gstIGST: 'gstIGST',
  discount: 'discount',
  transportCharges: 'transportCharges',
  coldChainCharges: 'coldChainCharges',
  deliveryTerms: 'deliveryTerms',
  paymentTerms: 'paymentTerms',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.QuoteLineItemScalarFieldEnum = {
  id: 'id',
  quotationId: 'quotationId',
  productId: 'productId',
  qty: 'qty',
  unitPrice: 'unitPrice',
  totalPrice: 'totalPrice'
};

exports.Prisma.SalesOrderScalarFieldEnum = {
  id: 'id',
  orderRef: 'orderRef',
  connectionId: 'connectionId',
  stage: 'stage',
  deliveryAddress: 'deliveryAddress',
  distanceKm: 'distanceKm',
  vehicleReq: 'vehicleReq',
  createdAt: 'createdAt'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  salesOrderId: 'salesOrderId',
  productId: 'productId',
  qty: 'qty',
  price: 'price',
  batchId: 'batchId',
  mfgDate: 'mfgDate',
  expiryDate: 'expiryDate'
};

exports.Prisma.InvoiceScalarFieldEnum = {
  id: 'id',
  invoiceNumber: 'invoiceNumber',
  salesOrderId: 'salesOrderId',
  dueDate: 'dueDate',
  totalAmount: 'totalAmount',
  paidAmount: 'paidAmount',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  amount: 'amount',
  method: 'method',
  referenceNo: 'referenceNo',
  bankName: 'bankName',
  paidAt: 'paidAt',
  status: 'status'
};

exports.Prisma.DeliveryChallanScalarFieldEnum = {
  id: 'id',
  challanNumber: 'challanNumber',
  salesOrderId: 'salesOrderId',
  vehicleNumber: 'vehicleNumber',
  driverName: 'driverName',
  driverPhone: 'driverPhone',
  tempInitialC: 'tempInitialC',
  tempFinalC: 'tempFinalC',
  signedBy: 'signedBy',
  deliveredAt: 'deliveredAt'
};

exports.Prisma.StorageLocationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  capacity: 'capacity',
  currentLoad: 'currentLoad',
  tempMin: 'tempMin',
  tempMax: 'tempMax',
  currentTemp: 'currentTemp',
  operational: 'operational',
  maintenanceLog: 'maintenanceLog'
};

exports.Prisma.InventoryStockScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  batchId: 'batchId',
  storageLocationId: 'storageLocationId',
  quantity: 'quantity',
  mfgDate: 'mfgDate',
  expiryDate: 'expiryDate',
  createdAt: 'createdAt'
};

exports.Prisma.InventoryTransactionScalarFieldEnum = {
  id: 'id',
  stockId: 'stockId',
  type: 'type',
  qty: 'qty',
  referenceType: 'referenceType',
  referenceId: 'referenceId',
  createdAt: 'createdAt'
};

exports.Prisma.PurchaseOrderScalarFieldEnum = {
  id: 'id',
  poRef: 'poRef',
  type: 'type',
  supplierId: 'supplierId',
  expectedDate: 'expectedDate',
  actualDate: 'actualDate',
  createdAt: 'createdAt'
};

exports.Prisma.POItemScalarFieldEnum = {
  id: 'id',
  purchaseOrderId: 'purchaseOrderId',
  description: 'description',
  qty: 'qty',
  unitPrice: 'unitPrice'
};

exports.Prisma.BillScalarFieldEnum = {
  id: 'id',
  billNumber: 'billNumber',
  supplierId: 'supplierId',
  dueDate: 'dueDate',
  amount: 'amount',
  paidAmount: 'paidAmount',
  status: 'status'
};

exports.Prisma.SupportTicketScalarFieldEnum = {
  id: 'id',
  ticketNumber: 'ticketNumber',
  connectionId: 'connectionId',
  issueType: 'issueType',
  priority: 'priority',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.TicketCommentScalarFieldEnum = {
  id: 'id',
  ticketId: 'ticketId',
  authorId: 'authorId',
  content: 'content',
  isInternal: 'isInternal',
  createdAt: 'createdAt'
};

exports.Prisma.SupplierFeedbackScalarFieldEnum = {
  id: 'id',
  supplierId: 'supplierId',
  feedbackType: 'feedbackType',
  details: 'details',
  resolved: 'resolved'
};

exports.Prisma.ActivityScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  notes: 'notes',
  relatedType: 'relatedType',
  relatedId: 'relatedId',
  createdAt: 'createdAt'
};

exports.Prisma.DocumentScalarFieldEnum = {
  id: 'id',
  name: 'name',
  path: 'path',
  category: 'category',
  relatedType: 'relatedType',
  relatedId: 'relatedId',
  uploadedById: 'uploadedById',
  uploadedAt: 'uploadedAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  body: 'body',
  isRead: 'isRead',
  createdAt: 'createdAt'
};

exports.Prisma.SalesTargetScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  period: 'period',
  amount: 'amount',
  achieved: 'achieved'
};

exports.Prisma.CommissionRuleScalarFieldEnum = {
  id: 'id',
  productCategory: 'productCategory',
  minAmount: 'minAmount',
  maxAmount: 'maxAmount',
  percentage: 'percentage'
};

exports.Prisma.CommissionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  orderId: 'orderId',
  amount: 'amount',
  paidStatus: 'paidStatus'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  action: 'action',
  entity: 'entity',
  entityId: 'entityId',
  meta: 'meta',
  createdAt: 'createdAt'
};

exports.Prisma.VerificationTokenScalarFieldEnum = {
  id: 'id',
  token: 'token',
  userId: 'userId',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  UserProfile: 'UserProfile',
  Role: 'Role',
  UserRole: 'UserRole',
  Department: 'Department',
  Connection: 'Connection',
  ContactPerson: 'ContactPerson',
  FSSAILicense: 'FSSAILicense',
  Product: 'Product',
  ProductPriceHistory: 'ProductPriceHistory',
  MilkCollectionCenter: 'MilkCollectionCenter',
  MilkProcurementEntry: 'MilkProcurementEntry',
  MilkRateChart: 'MilkRateChart',
  ProductionBatch: 'ProductionBatch',
  ProductionBatchItem: 'ProductionBatchItem',
  QualityTest: 'QualityTest',
  SalesInquiry: 'SalesInquiry',
  Quotation: 'Quotation',
  QuoteLineItem: 'QuoteLineItem',
  SalesOrder: 'SalesOrder',
  OrderItem: 'OrderItem',
  Invoice: 'Invoice',
  Payment: 'Payment',
  DeliveryChallan: 'DeliveryChallan',
  StorageLocation: 'StorageLocation',
  InventoryStock: 'InventoryStock',
  InventoryTransaction: 'InventoryTransaction',
  PurchaseOrder: 'PurchaseOrder',
  POItem: 'POItem',
  Bill: 'Bill',
  SupportTicket: 'SupportTicket',
  TicketComment: 'TicketComment',
  SupplierFeedback: 'SupplierFeedback',
  Activity: 'Activity',
  Document: 'Document',
  Notification: 'Notification',
  SalesTarget: 'SalesTarget',
  CommissionRule: 'CommissionRule',
  Commission: 'Commission',
  AuditLog: 'AuditLog',
  VerificationToken: 'VerificationToken'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\janih\\w\\o\\flavi-crm-next\\src\\generated\\prisma",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [
      "driverAdapters"
    ],
    "sourceFilePath": "C:\\Users\\janih\\w\\o\\flavi-crm-next\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null
  },
  "relativePath": "../../../prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "sqlite",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": null,
        "value": "file:./dev.db"
      }
    }
  },
  "inlineSchema": "generator client {\n  provider        = \"prisma-client-js\"\n  output          = \"../src/generated/prisma\"\n  previewFeatures = [\"driverAdapters\"]\n}\n\ndatasource db {\n  provider = \"sqlite\"\n  url      = \"file:./dev.db\" // ignored for D1 but required for Prisma CLI\n}\n\n// NOTE: Cloudflare D1 (SQLite) does not support native enums or Json columns in Prisma.\n// To keep compatibility with D1, enum-like fields are modelled as String and\n// Json fields are stored as text (String). Enforce allowed values in application code.\n\n// Core user and org models\nmodel User {\n  id                 String              @id @default(uuid())\n  email              String              @unique\n  password           String\n  isActive           Boolean             @default(true)\n  emailVerified      Boolean             @default(false)\n  createdAt          DateTime            @default(now())\n  updatedAt          DateTime            @updatedAt\n  lastLoginAt        DateTime?\n  profile            UserProfile?\n  roles              UserRole[]\n  departmentId       String?\n  department         Department?         @relation(fields: [departmentId], references: [id])\n  managerId          String?\n  manager            User?               @relation(\"UserManager\", fields: [managerId], references: [id])\n  reports            User[]              @relation(\"UserManager\")\n  activities         Activity[]\n  notifications      Notification[]\n  auditLogs          AuditLog[]\n  qualityTests       QualityTest[]\n  ticketComments     TicketComment[]\n  documentsUploaded  Document[]\n  salesTargets       SalesTarget[]\n  commissions        Commission[]\n  verificationTokens VerificationToken[]\n}\n\nmodel UserProfile {\n  id         String  @id @default(uuid())\n  userId     String  @unique\n  user       User    @relation(fields: [userId], references: [id])\n  fullName   String?\n  phone      String?\n  address    String?\n  city       String?\n  state      String?\n  postalCode String?\n  country    String?\n  roleTitle  String? // e.g., Sales Executive\n}\n\nmodel Role {\n  id    String     @id @default(uuid())\n  name  String     @unique\n  desc  String?\n  users UserRole[]\n}\n\nmodel UserRole {\n  id     String @id @default(uuid())\n  user   User   @relation(fields: [userId], references: [id])\n  userId String\n  role   Role   @relation(fields: [roleId], references: [id])\n  roleId String\n}\n\nmodel Department {\n  id    String  @id @default(uuid())\n  name  String  @unique\n  desc  String?\n  users User[]\n}\n\n// Connections and contacts\nmodel Connection {\n  id                  String                 @id @default(uuid())\n  name                String\n  type                String\n  businessCategory    String\n  primaryContactId    String?\n  contacts            ContactPerson[]\n  fssaiLicenses       FSSAILicense[]\n  gstNumber           String?\n  creditLimit         Float?                 @default(0)\n  paymentTermsDays    Int?                   @default(0)\n  hasColdStorage      Boolean?               @default(false)\n  deliveryPreferences String?\n  procurements        MilkProcurementEntry[]\n  salesInquiries      SalesInquiry[]\n  quotations          Quotation[]\n  salesOrders         SalesOrder[]\n  purchaseOrders      PurchaseOrder[]\n  bills               Bill[]\n  supportTickets      SupportTicket[]\n  supplierFeedbacks   SupplierFeedback[]\n  createdAt           DateTime               @default(now())\n  updatedAt           DateTime               @updatedAt\n}\n\nmodel ContactPerson {\n  id           String     @id @default(uuid())\n  connection   Connection @relation(fields: [connectionId], references: [id])\n  connectionId String\n  fullName     String\n  email        String?\n  phone        String?\n  isPrimary    Boolean    @default(false)\n}\n\nmodel FSSAILicense {\n  id            String     @id @default(uuid())\n  connection    Connection @relation(fields: [connectionId], references: [id])\n  connectionId  String\n  licenseNumber String\n  issueDate     DateTime?\n  expiryDate    DateTime?\n}\n\n// Products & catalog\nmodel Product {\n  id                         String                @id @default(uuid())\n  sku                        String?               @unique\n  name                       String\n  category                   String\n  subCategory                String?\n  description                String?\n  unit                       String\n  packSize                   String? // human readable: \"200 ml\", \"1 L\"\n  minFatPercent              Float? // quality parameter\n  minSnfPercent              Float?\n  shelfLifeDays              Int?\n  storageTempMin             Float?\n  storageTempMax             Float?\n  requiresColdChain          Boolean               @default(false)\n  unitPrice                  Float?\n  costPrice                  Float?\n  currentStock               Float?                @default(0)\n  reorderLevel               Float?                @default(0)\n  minOrderQuantity           Float?                @default(0)\n  priceHistory               ProductPriceHistory[]\n  inventoryStocks            InventoryStock[]\n  orderItems                 OrderItem[]\n  productionBatches          ProductionBatchItem[]\n  productionBatchesByProduct ProductionBatch[]\n  quoteLineItems             QuoteLineItem[]\n  salesInquiries             SalesInquiry[]\n}\n\nmodel ProductPriceHistory {\n  id        String    @id @default(uuid())\n  product   Product   @relation(fields: [productId], references: [id])\n  productId String\n  unitPrice Float\n  costPrice Float?\n  startDate DateTime  @default(now())\n  endDate   DateTime?\n}\n\n// Milk procurement\nmodel MilkCollectionCenter {\n  id              String                 @id @default(uuid())\n  name            String\n  latitude        Float?\n  longitude       Float?\n  dailyCapacityL  Float?                 @default(0)\n  bmrAvailable    Boolean?               @default(false)\n  hasTestingEquip Boolean?               @default(false)\n  procurements    MilkProcurementEntry[]\n}\n\nmodel MilkProcurementEntry {\n  id                 String                @id @default(uuid())\n  supplierId         String\n  supplier           Connection            @relation(fields: [supplierId], references: [id])\n  collectionCenterId String?\n  collectionCenter   MilkCollectionCenter? @relation(fields: [collectionCenterId], references: [id])\n  datetime           DateTime              @default(now())\n  quantityL          Float\n  fatPercent         Float?\n  snfPercent         Float?\n  clrReading         Float?\n  temperatureC       Float?\n  qualityGrade       String\n  ratePerLitre       Float\n  totalAmount        Float\n  paymentStatus      String                @default(\"PENDING\")\n  milkType           String?\n  createdAt          DateTime              @default(now())\n}\n\nmodel MilkRateChart {\n  id            String    @id @default(uuid())\n  fatPercentMin Float\n  fatPercentMax Float\n  snfPercentMin Float\n  snfPercentMax Float\n  milkType      String\n  qualityGrade  String\n  ratePerLitre  Float\n  effectiveFrom DateTime  @default(now())\n  effectiveTo   DateTime?\n}\n\n// Production\nmodel ProductionBatch {\n  id                String                @id @default(uuid())\n  batchNumber       String                @unique\n  productId         String\n  product           Product               @relation(fields: [productId], references: [id])\n  producedQty       Float\n  productionDate    DateTime              @default(now())\n  manufacturingDate DateTime?\n  expiryDate        DateTime?\n  status            String                @default(\"IN_PRODUCTION\")\n  items             ProductionBatchItem[]\n  orderItems        OrderItem[]\n  inventoryStocks   InventoryStock[]\n}\n\nmodel ProductionBatchItem {\n  id           String          @id @default(uuid())\n  batchId      String\n  batch        ProductionBatch @relation(fields: [batchId], references: [id])\n  productId    String\n  product      Product         @relation(fields: [productId], references: [id])\n  rawMilkUsedL Float?\n  quantity     Float\n}\n\n// Quality control\nmodel QualityTest {\n  id         String   @id @default(uuid())\n  testDate   DateTime @default(now())\n  testedById String?\n  testedBy   User?    @relation(fields: [testedById], references: [id])\n  targetType String // e.g., \"RawMilk\", \"Batch\", \"InProcess\"\n  targetId   String? // reference id\n  parameters String? // JSON stored as text for D1 compatibility\n  outcome    String\n  remarks    String?\n}\n\n// Sales pipeline\nmodel SalesInquiry {\n  id            String     @id @default(uuid())\n  inquiryNumber String     @unique\n  connectionId  String\n  connection    Connection @relation(fields: [connectionId], references: [id])\n  productId     String?\n  product       Product?   @relation(fields: [productId], references: [id])\n  quantity      Float?\n  quotedPrice   Float?\n  status        String?\n  source        String?\n  createdAt     DateTime   @default(now())\n}\n\nmodel Quotation {\n  id               String          @id @default(uuid())\n  quoteRef         String          @unique\n  connectionId     String\n  connection       Connection      @relation(fields: [connectionId], references: [id])\n  subtotal         Float\n  gstCGST          Float?\n  gstSGST          Float?\n  gstIGST          Float?\n  discount         Float?\n  transportCharges Float?\n  coldChainCharges Float?\n  deliveryTerms    String?\n  paymentTerms     String?\n  status           String?\n  createdAt        DateTime        @default(now())\n  lineItems        QuoteLineItem[]\n}\n\nmodel QuoteLineItem {\n  id          String    @id @default(uuid())\n  quotation   Quotation @relation(fields: [quotationId], references: [id])\n  quotationId String\n  productId   String\n  product     Product   @relation(fields: [productId], references: [id])\n  qty         Float\n  unitPrice   Float\n  totalPrice  Float\n}\n\nmodel SalesOrder {\n  id              String      @id @default(uuid())\n  orderRef        String      @unique\n  connectionId    String\n  connection      Connection  @relation(fields: [connectionId], references: [id])\n  stage           String?\n  deliveryAddress String?\n  distanceKm      Float?\n  vehicleReq      String?\n  createdAt       DateTime    @default(now())\n  items           OrderItem[]\n  invoices        Invoice[]\n}\n\nmodel OrderItem {\n  id           String           @id @default(uuid())\n  salesOrder   SalesOrder       @relation(fields: [salesOrderId], references: [id])\n  salesOrderId String\n  productId    String\n  product      Product          @relation(fields: [productId], references: [id])\n  qty          Float\n  price        Float\n  batchId      String?\n  batch        ProductionBatch? @relation(fields: [batchId], references: [id])\n  mfgDate      DateTime?\n  expiryDate   DateTime?\n}\n\nmodel Invoice {\n  id            String      @id @default(uuid())\n  invoiceNumber String      @unique\n  salesOrderId  String?\n  salesOrder    SalesOrder? @relation(fields: [salesOrderId], references: [id])\n  dueDate       DateTime?\n  totalAmount   Float\n  paidAmount    Float       @default(0)\n  status        String?\n  createdAt     DateTime    @default(now())\n  payments      Payment[]\n}\n\nmodel Payment {\n  id          String   @id @default(uuid())\n  invoiceId   String?\n  invoice     Invoice? @relation(fields: [invoiceId], references: [id])\n  amount      Float\n  method      String\n  referenceNo String?\n  bankName    String?\n  paidAt      DateTime @default(now())\n  status      String?\n}\n\nmodel DeliveryChallan {\n  id            String    @id @default(uuid())\n  challanNumber String    @unique\n  salesOrderId  String?\n  vehicleNumber String?\n  driverName    String?\n  driverPhone   String?\n  tempInitialC  Float?\n  tempFinalC    Float?\n  signedBy      String?\n  deliveredAt   DateTime?\n}\n\n// Inventory & cold chain\nmodel StorageLocation {\n  id             String           @id @default(uuid())\n  name           String\n  type           String // Cold Room / Freezer / Refrigerated Warehouse\n  capacity       Float?\n  currentLoad    Float?           @default(0)\n  tempMin        Float?\n  tempMax        Float?\n  currentTemp    Float?\n  operational    Boolean?         @default(true)\n  maintenanceLog String? // JSON stored as text for D1\n  stocks         InventoryStock[]\n}\n\nmodel InventoryStock {\n  id                String                 @id @default(uuid())\n  productId         String\n  product           Product                @relation(fields: [productId], references: [id])\n  batchId           String?\n  batch             ProductionBatch?       @relation(fields: [batchId], references: [id])\n  storageLocationId String\n  storageLocation   StorageLocation        @relation(fields: [storageLocationId], references: [id])\n  quantity          Float\n  mfgDate           DateTime?\n  expiryDate        DateTime?\n  createdAt         DateTime               @default(now())\n  txns              InventoryTransaction[]\n}\n\nmodel InventoryTransaction {\n  id            String         @id @default(uuid())\n  stockId       String\n  stock         InventoryStock @relation(fields: [stockId], references: [id])\n  type          String\n  qty           Float\n  referenceType String? // e.g., \"SalesOrder\", \"ProductionBatch\"\n  referenceId   String?\n  createdAt     DateTime       @default(now())\n}\n\n// Purchasing\nmodel PurchaseOrder {\n  id           String     @id @default(uuid())\n  poRef        String     @unique\n  type         String\n  supplierId   String\n  supplier     Connection @relation(fields: [supplierId], references: [id])\n  expectedDate DateTime?\n  actualDate   DateTime?\n  createdAt    DateTime   @default(now())\n  items        POItem[]\n}\n\nmodel POItem {\n  id              String        @id @default(uuid())\n  purchaseOrder   PurchaseOrder @relation(fields: [purchaseOrderId], references: [id])\n  purchaseOrderId String\n  description     String\n  qty             Float\n  unitPrice       Float\n}\n\nmodel Bill {\n  id         String     @id @default(uuid())\n  billNumber String     @unique\n  supplierId String\n  supplier   Connection @relation(fields: [supplierId], references: [id])\n  dueDate    DateTime?\n  amount     Float\n  paidAmount Float      @default(0)\n  status     String?\n}\n\n// Support & communication\nmodel SupportTicket {\n  id           String          @id @default(uuid())\n  ticketNumber String          @unique\n  connectionId String?\n  connection   Connection?     @relation(fields: [connectionId], references: [id])\n  issueType    String\n  priority     String\n  status       String\n  createdAt    DateTime        @default(now())\n  comments     TicketComment[]\n}\n\nmodel TicketComment {\n  id         String        @id @default(uuid())\n  ticketId   String\n  ticket     SupportTicket @relation(fields: [ticketId], references: [id])\n  authorId   String?\n  author     User?         @relation(fields: [authorId], references: [id])\n  content    String\n  isInternal Boolean       @default(false)\n  createdAt  DateTime      @default(now())\n}\n\nmodel SupplierFeedback {\n  id           String     @id @default(uuid())\n  supplierId   String\n  supplier     Connection @relation(fields: [supplierId], references: [id])\n  feedbackType String\n  details      String?\n  resolved     Boolean    @default(false)\n}\n\nmodel Activity {\n  id          String   @id @default(uuid())\n  userId      String?\n  user        User?    @relation(fields: [userId], references: [id])\n  type        String\n  notes       String?\n  relatedType String?\n  relatedId   String?\n  createdAt   DateTime @default(now())\n}\n\nmodel Document {\n  id           String   @id @default(uuid())\n  name         String\n  path         String\n  category     String?\n  relatedType  String?\n  relatedId    String?\n  uploadedById String?\n  uploadedBy   User?    @relation(fields: [uploadedById], references: [id])\n  uploadedAt   DateTime @default(now())\n}\n\nmodel Notification {\n  id        String   @id @default(uuid())\n  userId    String\n  user      User     @relation(fields: [userId], references: [id])\n  title     String\n  body      String?\n  isRead    Boolean  @default(false)\n  createdAt DateTime @default(now())\n}\n\n// Analytics & commission\nmodel SalesTarget {\n  id       String  @id @default(uuid())\n  userId   String?\n  user     User?   @relation(fields: [userId], references: [id])\n  period   String // e.g., 2025-11 (monthly), 2025-Q4\n  amount   Float\n  achieved Float   @default(0)\n}\n\nmodel CommissionRule {\n  id              String  @id @default(uuid())\n  productCategory String?\n  minAmount       Float?\n  maxAmount       Float?\n  percentage      Float\n}\n\nmodel Commission {\n  id         String  @id @default(uuid())\n  userId     String?\n  user       User?   @relation(fields: [userId], references: [id])\n  orderId    String?\n  amount     Float\n  paidStatus String?\n}\n\n// Audit\nmodel AuditLog {\n  id        String   @id @default(uuid())\n  userId    String?\n  user      User?    @relation(fields: [userId], references: [id])\n  action    String\n  entity    String\n  entityId  String?\n  meta      String? // JSON stored as text for D1\n  createdAt DateTime @default(now())\n}\n\n// Email Verification\nmodel VerificationToken {\n  id        String   @id @default(uuid())\n  token     String   @unique\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n}\n",
  "inlineSchemaHash": "4f3bff6fb6bacbbaf8ae2c1759f661427d9356771c813e0f0dc7e459296672e8",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"emailVerified\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lastLoginAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"profile\",\"kind\":\"object\",\"type\":\"UserProfile\",\"relationName\":\"UserToUserProfile\"},{\"name\":\"roles\",\"kind\":\"object\",\"type\":\"UserRole\",\"relationName\":\"UserToUserRole\"},{\"name\":\"departmentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"department\",\"kind\":\"object\",\"type\":\"Department\",\"relationName\":\"DepartmentToUser\"},{\"name\":\"managerId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"manager\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserManager\"},{\"name\":\"reports\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserManager\"},{\"name\":\"activities\",\"kind\":\"object\",\"type\":\"Activity\",\"relationName\":\"ActivityToUser\"},{\"name\":\"notifications\",\"kind\":\"object\",\"type\":\"Notification\",\"relationName\":\"NotificationToUser\"},{\"name\":\"auditLogs\",\"kind\":\"object\",\"type\":\"AuditLog\",\"relationName\":\"AuditLogToUser\"},{\"name\":\"qualityTests\",\"kind\":\"object\",\"type\":\"QualityTest\",\"relationName\":\"QualityTestToUser\"},{\"name\":\"ticketComments\",\"kind\":\"object\",\"type\":\"TicketComment\",\"relationName\":\"TicketCommentToUser\"},{\"name\":\"documentsUploaded\",\"kind\":\"object\",\"type\":\"Document\",\"relationName\":\"DocumentToUser\"},{\"name\":\"salesTargets\",\"kind\":\"object\",\"type\":\"SalesTarget\",\"relationName\":\"SalesTargetToUser\"},{\"name\":\"commissions\",\"kind\":\"object\",\"type\":\"Commission\",\"relationName\":\"CommissionToUser\"},{\"name\":\"verificationTokens\",\"kind\":\"object\",\"type\":\"VerificationToken\",\"relationName\":\"UserToVerificationToken\"}],\"dbName\":null},\"UserProfile\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToUserProfile\"},{\"name\":\"fullName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"address\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"city\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"state\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"postalCode\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"country\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"roleTitle\",\"kind\":\"scalar\",\"type\":\"String\"}],\"dbName\":null},\"Role\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"desc\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"users\",\"kind\":\"object\",\"type\":\"UserRole\",\"relationName\":\"RoleToUserRole\"}],\"dbName\":null},\"UserRole\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToUserRole\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"object\",\"type\":\"Role\",\"relationName\":\"RoleToUserRole\"},{\"name\":\"roleId\",\"kind\":\"scalar\",\"type\":\"String\"}],\"dbName\":null},\"Department\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"desc\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"users\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"DepartmentToUser\"}],\"dbName\":null},\"Connection\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"businessCategory\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"primaryContactId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"contacts\",\"kind\":\"object\",\"type\":\"ContactPerson\",\"relationName\":\"ConnectionToContactPerson\"},{\"name\":\"fssaiLicenses\",\"kind\":\"object\",\"type\":\"FSSAILicense\",\"relationName\":\"ConnectionToFSSAILicense\"},{\"name\":\"gstNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"creditLimit\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"paymentTermsDays\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"hasColdStorage\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"deliveryPreferences\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"procurements\",\"kind\":\"object\",\"type\":\"MilkProcurementEntry\",\"relationName\":\"ConnectionToMilkProcurementEntry\"},{\"name\":\"salesInquiries\",\"kind\":\"object\",\"type\":\"SalesInquiry\",\"relationName\":\"ConnectionToSalesInquiry\"},{\"name\":\"quotations\",\"kind\":\"object\",\"type\":\"Quotation\",\"relationName\":\"ConnectionToQuotation\"},{\"name\":\"salesOrders\",\"kind\":\"object\",\"type\":\"SalesOrder\",\"relationName\":\"ConnectionToSalesOrder\"},{\"name\":\"purchaseOrders\",\"kind\":\"object\",\"type\":\"PurchaseOrder\",\"relationName\":\"ConnectionToPurchaseOrder\"},{\"name\":\"bills\",\"kind\":\"object\",\"type\":\"Bill\",\"relationName\":\"BillToConnection\"},{\"name\":\"supportTickets\",\"kind\":\"object\",\"type\":\"SupportTicket\",\"relationName\":\"ConnectionToSupportTicket\"},{\"name\":\"supplierFeedbacks\",\"kind\":\"object\",\"type\":\"SupplierFeedback\",\"relationName\":\"ConnectionToSupplierFeedback\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"ContactPerson\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"connection\",\"kind\":\"object\",\"type\":\"Connection\",\"relationName\":\"ConnectionToContactPerson\"},{\"name\":\"connectionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fullName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isPrimary\",\"kind\":\"scalar\",\"type\":\"Boolean\"}],\"dbName\":null},\"FSSAILicense\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"connection\",\"kind\":\"object\",\"type\":\"Connection\",\"relationName\":\"ConnectionToFSSAILicense\"},{\"name\":\"connectionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"licenseNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"issueDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"expiryDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Product\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sku\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"subCategory\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"unit\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"packSize\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"minFatPercent\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"minSnfPercent\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"shelfLifeDays\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"storageTempMin\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"storageTempMax\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"requiresColdChain\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"unitPrice\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"costPrice\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"currentStock\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"reorderLevel\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"minOrderQuantity\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"priceHistory\",\"kind\":\"object\",\"type\":\"ProductPriceHistory\",\"relationName\":\"ProductToProductPriceHistory\"},{\"name\":\"inventoryStocks\",\"kind\":\"object\",\"type\":\"InventoryStock\",\"relationName\":\"InventoryStockToProduct\"},{\"name\":\"orderItems\",\"kind\":\"object\",\"type\":\"OrderItem\",\"relationName\":\"OrderItemToProduct\"},{\"name\":\"productionBatches\",\"kind\":\"object\",\"type\":\"ProductionBatchItem\",\"relationName\":\"ProductToProductionBatchItem\"},{\"name\":\"productionBatchesByProduct\",\"kind\":\"object\",\"type\":\"ProductionBatch\",\"relationName\":\"ProductToProductionBatch\"},{\"name\":\"quoteLineItems\",\"kind\":\"object\",\"type\":\"QuoteLineItem\",\"relationName\":\"ProductToQuoteLineItem\"},{\"name\":\"salesInquiries\",\"kind\":\"object\",\"type\":\"SalesInquiry\",\"relationName\":\"ProductToSalesInquiry\"}],\"dbName\":null},\"ProductPriceHistory\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToProductPriceHistory\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"unitPrice\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"costPrice\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"startDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"endDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"MilkCollectionCenter\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"latitude\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"longitude\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"dailyCapacityL\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"bmrAvailable\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"hasTestingEquip\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"procurements\",\"kind\":\"object\",\"type\":\"MilkProcurementEntry\",\"relationName\":\"MilkCollectionCenterToMilkProcurementEntry\"}],\"dbName\":null},\"MilkProcurementEntry\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"supplierId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"supplier\",\"kind\":\"object\",\"type\":\"Connection\",\"relationName\":\"ConnectionToMilkProcurementEntry\"},{\"name\":\"collectionCenterId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"collectionCenter\",\"kind\":\"object\",\"type\":\"MilkCollectionCenter\",\"relationName\":\"MilkCollectionCenterToMilkProcurementEntry\"},{\"name\":\"datetime\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"quantityL\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"fatPercent\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"snfPercent\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"clrReading\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"temperatureC\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"qualityGrade\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"ratePerLitre\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"totalAmount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"paymentStatus\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"milkType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"MilkRateChart\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fatPercentMin\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"fatPercentMax\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"snfPercentMin\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"snfPercentMax\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"milkType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"qualityGrade\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"ratePerLitre\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"effectiveFrom\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"effectiveTo\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"ProductionBatch\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"batchNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToProductionBatch\"},{\"name\":\"producedQty\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"productionDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"manufacturingDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"expiryDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"items\",\"kind\":\"object\",\"type\":\"ProductionBatchItem\",\"relationName\":\"ProductionBatchToProductionBatchItem\"},{\"name\":\"orderItems\",\"kind\":\"object\",\"type\":\"OrderItem\",\"relationName\":\"OrderItemToProductionBatch\"},{\"name\":\"inventoryStocks\",\"kind\":\"object\",\"type\":\"InventoryStock\",\"relationName\":\"InventoryStockToProductionBatch\"}],\"dbName\":null},\"ProductionBatchItem\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"batchId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"batch\",\"kind\":\"object\",\"type\":\"ProductionBatch\",\"relationName\":\"ProductionBatchToProductionBatchItem\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToProductionBatchItem\"},{\"name\":\"rawMilkUsedL\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Float\"}],\"dbName\":null},\"QualityTest\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"testDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"testedById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"testedBy\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"QualityTestToUser\"},{\"name\":\"targetType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"targetId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"parameters\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"outcome\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"remarks\",\"kind\":\"scalar\",\"type\":\"String\"}],\"dbName\":null},\"SalesInquiry\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"inquiryNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"connectionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"connection\",\"kind\":\"object\",\"type\":\"Connection\",\"relationName\":\"ConnectionToSalesInquiry\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToSalesInquiry\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"quotedPrice\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"source\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Quotation\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"quoteRef\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"connectionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"connection\",\"kind\":\"object\",\"type\":\"Connection\",\"relationName\":\"ConnectionToQuotation\"},{\"name\":\"subtotal\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"gstCGST\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"gstSGST\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"gstIGST\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"discount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"transportCharges\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"coldChainCharges\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"deliveryTerms\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"paymentTerms\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lineItems\",\"kind\":\"object\",\"type\":\"QuoteLineItem\",\"relationName\":\"QuotationToQuoteLineItem\"}],\"dbName\":null},\"QuoteLineItem\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"quotation\",\"kind\":\"object\",\"type\":\"Quotation\",\"relationName\":\"QuotationToQuoteLineItem\"},{\"name\":\"quotationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToQuoteLineItem\"},{\"name\":\"qty\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"unitPrice\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"totalPrice\",\"kind\":\"scalar\",\"type\":\"Float\"}],\"dbName\":null},\"SalesOrder\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"orderRef\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"connectionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"connection\",\"kind\":\"object\",\"type\":\"Connection\",\"relationName\":\"ConnectionToSalesOrder\"},{\"name\":\"stage\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"deliveryAddress\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"distanceKm\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"vehicleReq\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"items\",\"kind\":\"object\",\"type\":\"OrderItem\",\"relationName\":\"OrderItemToSalesOrder\"},{\"name\":\"invoices\",\"kind\":\"object\",\"type\":\"Invoice\",\"relationName\":\"InvoiceToSalesOrder\"}],\"dbName\":null},\"OrderItem\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"salesOrder\",\"kind\":\"object\",\"type\":\"SalesOrder\",\"relationName\":\"OrderItemToSalesOrder\"},{\"name\":\"salesOrderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"OrderItemToProduct\"},{\"name\":\"qty\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"price\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"batchId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"batch\",\"kind\":\"object\",\"type\":\"ProductionBatch\",\"relationName\":\"OrderItemToProductionBatch\"},{\"name\":\"mfgDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"expiryDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Invoice\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"invoiceNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"salesOrderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"salesOrder\",\"kind\":\"object\",\"type\":\"SalesOrder\",\"relationName\":\"InvoiceToSalesOrder\"},{\"name\":\"dueDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"totalAmount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"paidAmount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"payments\",\"kind\":\"object\",\"type\":\"Payment\",\"relationName\":\"InvoiceToPayment\"}],\"dbName\":null},\"Payment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"invoiceId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"invoice\",\"kind\":\"object\",\"type\":\"Invoice\",\"relationName\":\"InvoiceToPayment\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"method\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"referenceNo\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"bankName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"paidAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"}],\"dbName\":null},\"DeliveryChallan\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"challanNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"salesOrderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vehicleNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"driverName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"driverPhone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"tempInitialC\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"tempFinalC\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"signedBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"deliveredAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"StorageLocation\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"capacity\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"currentLoad\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"tempMin\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"tempMax\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"currentTemp\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"operational\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"maintenanceLog\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"stocks\",\"kind\":\"object\",\"type\":\"InventoryStock\",\"relationName\":\"InventoryStockToStorageLocation\"}],\"dbName\":null},\"InventoryStock\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"InventoryStockToProduct\"},{\"name\":\"batchId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"batch\",\"kind\":\"object\",\"type\":\"ProductionBatch\",\"relationName\":\"InventoryStockToProductionBatch\"},{\"name\":\"storageLocationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"storageLocation\",\"kind\":\"object\",\"type\":\"StorageLocation\",\"relationName\":\"InventoryStockToStorageLocation\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"mfgDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"expiryDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"txns\",\"kind\":\"object\",\"type\":\"InventoryTransaction\",\"relationName\":\"InventoryStockToInventoryTransaction\"}],\"dbName\":null},\"InventoryTransaction\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"stockId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"stock\",\"kind\":\"object\",\"type\":\"InventoryStock\",\"relationName\":\"InventoryStockToInventoryTransaction\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"qty\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"referenceType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"referenceId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"PurchaseOrder\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"poRef\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"supplierId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"supplier\",\"kind\":\"object\",\"type\":\"Connection\",\"relationName\":\"ConnectionToPurchaseOrder\"},{\"name\":\"expectedDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"actualDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"items\",\"kind\":\"object\",\"type\":\"POItem\",\"relationName\":\"POItemToPurchaseOrder\"}],\"dbName\":null},\"POItem\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"purchaseOrder\",\"kind\":\"object\",\"type\":\"PurchaseOrder\",\"relationName\":\"POItemToPurchaseOrder\"},{\"name\":\"purchaseOrderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"qty\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"unitPrice\",\"kind\":\"scalar\",\"type\":\"Float\"}],\"dbName\":null},\"Bill\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"billNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"supplierId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"supplier\",\"kind\":\"object\",\"type\":\"Connection\",\"relationName\":\"BillToConnection\"},{\"name\":\"dueDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"paidAmount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"}],\"dbName\":null},\"SupportTicket\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"ticketNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"connectionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"connection\",\"kind\":\"object\",\"type\":\"Connection\",\"relationName\":\"ConnectionToSupportTicket\"},{\"name\":\"issueType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"priority\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"comments\",\"kind\":\"object\",\"type\":\"TicketComment\",\"relationName\":\"SupportTicketToTicketComment\"}],\"dbName\":null},\"TicketComment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"ticketId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"ticket\",\"kind\":\"object\",\"type\":\"SupportTicket\",\"relationName\":\"SupportTicketToTicketComment\"},{\"name\":\"authorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"author\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"TicketCommentToUser\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isInternal\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"SupplierFeedback\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"supplierId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"supplier\",\"kind\":\"object\",\"type\":\"Connection\",\"relationName\":\"ConnectionToSupplierFeedback\"},{\"name\":\"feedbackType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"details\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"resolved\",\"kind\":\"scalar\",\"type\":\"Boolean\"}],\"dbName\":null},\"Activity\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ActivityToUser\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"relatedType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"relatedId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Document\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"path\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"relatedType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"relatedId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"uploadedById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"uploadedBy\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"DocumentToUser\"},{\"name\":\"uploadedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Notification\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"NotificationToUser\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"body\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isRead\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"SalesTarget\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"SalesTargetToUser\"},{\"name\":\"period\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"achieved\",\"kind\":\"scalar\",\"type\":\"Float\"}],\"dbName\":null},\"CommissionRule\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productCategory\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"minAmount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"maxAmount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"percentage\",\"kind\":\"scalar\",\"type\":\"Float\"}],\"dbName\":null},\"Commission\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"CommissionToUser\"},{\"name\":\"orderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"paidStatus\",\"kind\":\"scalar\",\"type\":\"String\"}],\"dbName\":null},\"AuditLog\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AuditLogToUser\"},{\"name\":\"action\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"entity\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"entityId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"meta\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"VerificationToken\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToVerificationToken\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = {
  getRuntime: () => require('./query_engine_bg.js'),
  getQueryEngineWasmModule: async () => {
    const loader = (await import('#wasm-engine-loader')).default
    const engine = (await loader).default
    return engine 
  }
}

config.injectableEdgeEnv = () => ({
  parsed: {}
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

