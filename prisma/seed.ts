import prisma from "@/lib/prisma";
// Helper function to get Unix timestamp
const getUnixTimestamp = (date: Date): number =>
  Math.floor(date.getTime() / 1000);

// Helper to get date N days ago
const daysAgo = (days: number): number => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return getUnixTimestamp(date);
};

// Helper to get date N days from now
const daysFromNow = (days: number): number => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return getUnixTimestamp(date);
};

async function main() {
  console.log("🌱 Starting seed...");

  // Clean existing data (in reverse order of dependencies)
  console.log("🧹 Cleaning existing data...");
  await prisma.verificationToken.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.commission.deleteMany();
  await prisma.commissionRule.deleteMany();
  await prisma.salesTarget.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.document.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.supplierFeedback.deleteMany();
  await prisma.ticketComment.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.pOItem.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.inventoryTransaction.deleteMany();
  await prisma.inventoryStock.deleteMany();
  await prisma.storageLocation.deleteMany();
  await prisma.deliveryChallan.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.salesOrder.deleteMany();
  await prisma.quoteLineItem.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.salesInquiry.deleteMany();
  await prisma.qualityTest.deleteMany();
  await prisma.productionBatchItem.deleteMany();
  await prisma.productionBatch.deleteMany();
  await prisma.milkRateChart.deleteMany();
  await prisma.milkProcurementEntry.deleteMany();
  await prisma.milkCollectionCenter.deleteMany();
  await prisma.productPriceHistory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.fSSAILicense.deleteMany();
  await prisma.contactPerson.deleteMany();
  await prisma.connection.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  await prisma.role.deleteMany();

  // 1. Create Roles
  console.log("👥 Creating roles...");
  const adminRole = await prisma.role.create({
    data: {
      name: "ADMIN",
      desc: "System administrator with full access",
    },
  });

  const managerRole = await prisma.role.create({
    data: {
      name: "MANAGER",
      desc: "Department manager with extended permissions",
    },
  });

  const salesRole = await prisma.role.create({
    data: {
      name: "SALES",
      desc: "Sales representative",
    },
  });

  const procurementRole = await prisma.role.create({
    data: {
      name: "PROCUREMENT",
      desc: "Procurement officer",
    },
  });

  const productionRole = await prisma.role.create({
    data: {
      name: "PRODUCTION",
      desc: "Production staff",
    },
  });

  const qualityRole = await prisma.role.create({
    data: {
      name: "QUALITY",
      desc: "Quality control officer",
    },
  });

  // 2. Create Departments
  console.log("🏢 Creating departments...");
  const salesDept = await prisma.department.create({
    data: {
      name: "Sales",
      desc: "Sales and customer relations",
    },
  });

  const procurementDept = await prisma.department.create({
    data: {
      name: "Procurement",
      desc: "Raw milk procurement and supplier management",
    },
  });

  const productionDept = await prisma.department.create({
    data: {
      name: "Production",
      desc: "Manufacturing and production operations",
    },
  });

  const qualityDept = await prisma.department.create({
    data: {
      name: "Quality Control",
      desc: "Quality assurance and testing",
    },
  });

  const logisticsDept = await prisma.department.create({
    data: {
      name: "Logistics",
      desc: "Inventory and distribution management",
    },
  });

  // 3. Create Users
  console.log("👤 Creating users...");
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@dairyfresh.com",
      password: "$2a$10$YourHashedPasswordHere", // Replace with actual bcrypt hash
      isActive: 1,
      emailVerified: 1,
      createdAt: daysAgo(180),
      updatedAt: daysAgo(1),
      lastLoginAt: daysAgo(0),
      profile: {
        create: {
          fullName: "Admin User",
          phone: "+91 98765 43210",
          address: "123 Dairy Lane",
          city: "Rajkot",
          state: "Gujarat",
          postalCode: "360001",
          country: "India",
          roleTitle: "System Administrator",
        },
      },
      roles: {
        create: {
          roleId: adminRole.id,
        },
      },
    },
  });

  const salesManager = await prisma.user.create({
    data: {
      email: "sales.manager@dairyfresh.com",
      password: "$2a$10$YourHashedPasswordHere",
      isActive: 1,
      emailVerified: 1,
      departmentId: salesDept.id,
      createdAt: daysAgo(150),
      updatedAt: daysAgo(2),
      lastLoginAt: daysAgo(0),
      profile: {
        create: {
          fullName: "Rajesh Kumar",
          phone: "+91 98765 11111",
          address: "456 Market Street",
          city: "Rajkot",
          state: "Gujarat",
          postalCode: "360002",
          country: "India",
          roleTitle: "Sales Manager",
        },
      },
      roles: {
        create: [{ roleId: managerRole.id }, { roleId: salesRole.id }],
      },
    },
  });

  const salesRep1 = await prisma.user.create({
    data: {
      email: "priya.patel@dairyfresh.com",
      password: "$2a$10$YourHashedPasswordHere",
      isActive: 1,
      emailVerified: 1,
      departmentId: salesDept.id,
      managerId: salesManager.id,
      createdAt: daysAgo(120),
      updatedAt: daysAgo(1),
      lastLoginAt: daysAgo(0),
      profile: {
        create: {
          fullName: "Priya Patel",
          phone: "+91 98765 22222",
          address: "789 Commerce Road",
          city: "Rajkot",
          state: "Gujarat",
          postalCode: "360003",
          country: "India",
          roleTitle: "Sales Representative",
        },
      },
      roles: {
        create: {
          roleId: salesRole.id,
        },
      },
    },
  });

  const procurementOfficer = await prisma.user.create({
    data: {
      email: "amit.shah@dairyfresh.com",
      password: "$2a$10$YourHashedPasswordHere",
      isActive: 1,
      emailVerified: 1,
      departmentId: procurementDept.id,
      createdAt: daysAgo(140),
      updatedAt: daysAgo(3),
      lastLoginAt: daysAgo(1),
      profile: {
        create: {
          fullName: "Amit Shah",
          phone: "+91 98765 33333",
          address: "321 Procurement Lane",
          city: "Rajkot",
          state: "Gujarat",
          postalCode: "360004",
          country: "India",
          roleTitle: "Procurement Officer",
        },
      },
      roles: {
        create: {
          roleId: procurementRole.id,
        },
      },
    },
  });

  const productionSupervisor = await prisma.user.create({
    data: {
      email: "meena.desai@dairyfresh.com",
      password: "$2a$10$YourHashedPasswordHere",
      isActive: 1,
      emailVerified: 1,
      departmentId: productionDept.id,
      createdAt: daysAgo(160),
      updatedAt: daysAgo(2),
      lastLoginAt: daysAgo(0),
      profile: {
        create: {
          fullName: "Meena Desai",
          phone: "+91 98765 44444",
          address: "654 Factory Road",
          city: "Rajkot",
          state: "Gujarat",
          postalCode: "360005",
          country: "India",
          roleTitle: "Production Supervisor",
        },
      },
      roles: {
        create: {
          roleId: productionRole.id,
        },
      },
    },
  });

  const qualityOfficer = await prisma.user.create({
    data: {
      email: "kiran.mehta@dairyfresh.com",
      password: "$2a$10$YourHashedPasswordHere",
      isActive: 1,
      emailVerified: 1,
      departmentId: qualityDept.id,
      createdAt: daysAgo(130),
      updatedAt: daysAgo(1),
      lastLoginAt: daysAgo(0),
      profile: {
        create: {
          fullName: "Kiran Mehta",
          phone: "+91 98765 55555",
          address: "987 Quality Street",
          city: "Rajkot",
          state: "Gujarat",
          postalCode: "360006",
          country: "India",
          roleTitle: "Quality Control Officer",
        },
      },
      roles: {
        create: {
          roleId: qualityRole.id,
        },
      },
    },
  });

  // 4. Create Connections (Suppliers and Customers)
  console.log("🔗 Creating connections...");

  const supplier1 = await prisma.connection.create({
    data: {
      name: "Green Valley Dairy Farm",
      type: "SUPPLIER",
      businessCategory: "DAIRY_FARM",
      gstNumber: "24ABCDE1234F1Z5",
      creditLimit: 500000,
      paymentTermsDays: 7,
      hasColdStorage: 1,
      deliveryPreferences: "Morning collection preferred",
      createdAt: daysAgo(200),
      updatedAt: daysAgo(5),
      contacts: {
        create: [
          {
            fullName: "Ramesh Patel",
            email: "ramesh@greenvalley.com",
            phone: "+91 98765 66666",
            isPrimary: 1,
          },
          {
            fullName: "Suresh Patel",
            email: "suresh@greenvalley.com",
            phone: "+91 98765 66667",
            isPrimary: 0,
          },
        ],
      },
      fssaiLicenses: {
        create: {
          licenseNumber: "FSSAI-10012011001234",
          issueDate: daysAgo(730),
          expiryDate: daysFromNow(1095),
        },
      },
    },
  });

  const supplier2 = await prisma.connection.create({
    data: {
      name: "Sunrise Milk Producers",
      type: "SUPPLIER",
      businessCategory: "DAIRY_FARM",
      gstNumber: "24FGHIJ5678K1Z9",
      creditLimit: 300000,
      paymentTermsDays: 7,
      hasColdStorage: 0,
      deliveryPreferences: "Evening collection",
      createdAt: daysAgo(180),
      updatedAt: daysAgo(3),
      contacts: {
        create: {
          fullName: "Dinesh Joshi",
          email: "dinesh@sunrisemilk.com",
          phone: "+91 98765 77777",
          isPrimary: 1,
        },
      },
      fssaiLicenses: {
        create: {
          licenseNumber: "FSSAI-10012011005678",
          issueDate: daysAgo(650),
          expiryDate: daysFromNow(1200),
        },
      },
    },
  });

  const customer1 = await prisma.connection.create({
    data: {
      name: "Metro Supermarkets Ltd",
      type: "CUSTOMER",
      businessCategory: "DISTRIBUTOR",
      gstNumber: "24KLMNO9012P1Z3",
      creditLimit: 1000000,
      paymentTermsDays: 30,
      hasColdStorage: 1,
      deliveryPreferences: "Bulk orders, weekly delivery",
      createdAt: daysAgo(150),
      updatedAt: daysAgo(2),
      contacts: {
        create: [
          {
            fullName: "Vikram Singh",
            email: "vikram@metrosuper.com",
            phone: "+91 98765 88888",
            isPrimary: 1,
          },
          {
            fullName: "Anjali Sharma",
            email: "anjali@metrosuper.com",
            phone: "+91 98765 88889",
            isPrimary: 0,
          },
        ],
      },
    },
  });

  const customer2 = await prisma.connection.create({
    data: {
      name: "Fresh Mart Chain",
      type: "CUSTOMER",
      businessCategory: "DISTRIBUTOR",
      gstNumber: "24QRSTU3456V1Z7",
      creditLimit: 750000,
      paymentTermsDays: 15,
      hasColdStorage: 1,
      deliveryPreferences: "Daily deliveries required",
      createdAt: daysAgo(120),
      updatedAt: daysAgo(1),
      contacts: {
        create: {
          fullName: "Neha Gupta",
          email: "neha@freshmart.com",
          phone: "+91 98765 99999",
          isPrimary: 1,
        },
      },
    },
  });

  const customer3 = await prisma.connection.create({
    data: {
      name: "Hotel Rajwada",
      type: "CUSTOMER",
      businessCategory: "HOTEL",
      gstNumber: "24WXYZ7890A1Z2",
      creditLimit: 200000,
      paymentTermsDays: 7,
      hasColdStorage: 1,
      deliveryPreferences: "Early morning delivery",
      createdAt: daysAgo(90),
      updatedAt: daysAgo(1),
      contacts: {
        create: {
          fullName: "Arjun Rathore",
          email: "arjun@hotelrajwada.com",
          phone: "+91 98765 00000",
          isPrimary: 1,
        },
      },
    },
  });

  // 5. Create Milk Collection Centers
  console.log("🥛 Creating milk collection centers...");
  const center1 = await prisma.milkCollectionCenter.create({
    data: {
      name: "Rajkot Central Collection Center",
      latitude: 22.3039,
      longitude: 70.8022,
      dailyCapacityL: 5000,
      bmrAvailable: 1,
      hasTestingEquip: 1,
    },
  });

  const center2 = await prisma.milkCollectionCenter.create({
    data: {
      name: "Gondal Road Collection Point",
      latitude: 22.2837,
      longitude: 70.7833,
      dailyCapacityL: 3000,
      bmrAvailable: 1,
      hasTestingEquip: 1,
    },
  });

  // 6. Create Milk Rate Chart
  console.log("💰 Creating milk rate chart...");
  const rateCharts = [
    {
      fatPercentMin: 3.0,
      fatPercentMax: 3.5,
      snfPercentMin: 8.0,
      snfPercentMax: 8.5,
      milkType: "COW",
      qualityGrade: "A",
      ratePerLitre: 32.0,
    },
    {
      fatPercentMin: 3.5,
      fatPercentMax: 4.0,
      snfPercentMin: 8.5,
      snfPercentMax: 9.0,
      milkType: "COW",
      qualityGrade: "A",
      ratePerLitre: 35.0,
    },
    {
      fatPercentMin: 4.5,
      fatPercentMax: 5.5,
      snfPercentMin: 8.5,
      snfPercentMax: 9.0,
      milkType: "BUFFALO",
      qualityGrade: "A",
      ratePerLitre: 42.0,
    },
    {
      fatPercentMin: 5.5,
      fatPercentMax: 7.0,
      snfPercentMin: 9.0,
      snfPercentMax: 10.0,
      milkType: "BUFFALO",
      qualityGrade: "A",
      ratePerLitre: 48.0,
    },
  ];

  for (const rate of rateCharts) {
    await prisma.milkRateChart.create({
      data: {
        ...rate,
        effectiveFrom: daysAgo(90),
        effectiveTo: null,
      },
    });
  }

  // 7. Create Milk Procurement Entries
  console.log("📝 Creating milk procurement entries...");
  const procurementEntries = [];

  // Create entries for last 30 days
  for (let day = 30; day >= 0; day--) {
    // Supplier 1 - Morning collection
    procurementEntries.push(
      prisma.milkProcurementEntry.create({
        data: {
          supplierId: supplier1.id,
          collectionCenterId: center1.id,
          datetime: daysAgo(day),
          quantityL: 500 + Math.random() * 200,
          fatPercent: 3.5 + Math.random() * 0.5,
          snfPercent: 8.5 + Math.random() * 0.3,
          clrReading: 28 + Math.random() * 2,
          temperatureC: 4 + Math.random() * 2,
          qualityGrade: "A",
          ratePerLitre: 35,
          totalAmount: 35 * (500 + Math.random() * 200),
          paymentStatus: day < 7 ? "PAID" : "PENDING",
          milkType: "COW",
          createdAt: daysAgo(day),
        },
      })
    );

    // Supplier 1 - Evening collection
    procurementEntries.push(
      prisma.milkProcurementEntry.create({
        data: {
          supplierId: supplier1.id,
          collectionCenterId: center1.id,
          datetime: daysAgo(day) - 3600 * 12, // 12 hours later
          quantityL: 450 + Math.random() * 150,
          fatPercent: 3.6 + Math.random() * 0.4,
          snfPercent: 8.6 + Math.random() * 0.3,
          clrReading: 28.5 + Math.random() * 1.5,
          temperatureC: 5 + Math.random() * 2,
          qualityGrade: "A",
          ratePerLitre: 35,
          totalAmount: 35 * (450 + Math.random() * 150),
          paymentStatus: day < 7 ? "PAID" : "PENDING",
          milkType: "COW",
          createdAt: daysAgo(day) - 3600 * 12,
        },
      })
    );

    // Supplier 2 - Evening collection only
    procurementEntries.push(
      prisma.milkProcurementEntry.create({
        data: {
          supplierId: supplier2.id,
          collectionCenterId: center2.id,
          datetime: daysAgo(day) - 3600 * 14,
          quantityL: 300 + Math.random() * 100,
          fatPercent: 5.5 + Math.random() * 1.0,
          snfPercent: 9.0 + Math.random() * 0.5,
          clrReading: 29 + Math.random() * 1,
          temperatureC: 4 + Math.random() * 1.5,
          qualityGrade: "A",
          ratePerLitre: 48,
          totalAmount: 48 * (300 + Math.random() * 100),
          paymentStatus: day < 7 ? "PAID" : "PENDING",
          milkType: "BUFFALO",
          createdAt: daysAgo(day) - 3600 * 14,
        },
      })
    );
  }

  await Promise.all(procurementEntries);

  // 8. Create Products
  console.log("🧈 Creating products...");
  const fullCreamMilk = await prisma.product.create({
    data: {
      sku: "MILK-FCM-1L",
      name: "Full Cream Milk",
      category: "MILK",
      subCategory: "FULL_CREAM",
      description: "Fresh full cream milk, rich and creamy",
      unit: "LITRE",
      packSize: "1 L",
      minFatPercent: 6.0,
      minSnfPercent: 9.0,
      shelfLifeDays: 3,
      storageTempMin: 2,
      storageTempMax: 6,
      requiresColdChain: 1,
      unitPrice: 65,
      costPrice: 45,
      currentStock: 500,
      reorderLevel: 100,
      minOrderQuantity: 50,
    },
  });

  const tonedMilk = await prisma.product.create({
    data: {
      sku: "MILK-TND-1L",
      name: "Toned Milk",
      category: "MILK",
      subCategory: "TONED",
      description: "Toned milk with balanced nutrition",
      unit: "LITRE",
      packSize: "1 L",
      minFatPercent: 3.0,
      minSnfPercent: 8.5,
      shelfLifeDays: 3,
      storageTempMin: 2,
      storageTempMax: 6,
      requiresColdChain: 1,
      unitPrice: 52,
      costPrice: 36,
      currentStock: 800,
      reorderLevel: 150,
      minOrderQuantity: 100,
    },
  });

  const curd = await prisma.product.create({
    data: {
      sku: "CURD-500G",
      name: "Fresh Curd",
      category: "CURD",
      description: "Freshly set curd, smooth and creamy",
      unit: "KG",
      packSize: "500 g",
      shelfLifeDays: 4,
      storageTempMin: 2,
      storageTempMax: 8,
      requiresColdChain: 1,
      unitPrice: 45,
      costPrice: 30,
      currentStock: 300,
      reorderLevel: 50,
      minOrderQuantity: 30,
    },
  });

  const butter = await prisma.product.create({
    data: {
      sku: "BUTTER-100G",
      name: "Premium Butter",
      category: "BUTTER",
      description: "Creamy butter made from fresh cream",
      unit: "KG",
      packSize: "100 g",
      minFatPercent: 80.0,
      shelfLifeDays: 90,
      storageTempMin: 2,
      storageTempMax: 8,
      requiresColdChain: 1,
      unitPrice: 60,
      costPrice: 42,
      currentStock: 200,
      reorderLevel: 40,
      minOrderQuantity: 50,
    },
  });

  const paneer = await prisma.product.create({
    data: {
      sku: "PANEER-200G",
      name: "Fresh Paneer",
      category: "PANEER",
      description: "Soft and fresh paneer",
      unit: "KG",
      packSize: "200 g",
      shelfLifeDays: 5,
      storageTempMin: 2,
      storageTempMax: 6,
      requiresColdChain: 1,
      unitPrice: 90,
      costPrice: 65,
      currentStock: 150,
      reorderLevel: 30,
      minOrderQuantity: 25,
    },
  });

  const ghee = await prisma.product.create({
    data: {
      sku: "GHEE-500ML",
      name: "Pure Cow Ghee",
      category: "GHEE",
      description: "Traditional pure cow ghee",
      unit: "LITRE",
      packSize: "500 ml",
      minFatPercent: 99.5,
      shelfLifeDays: 365,
      storageTempMin: 15,
      storageTempMax: 25,
      requiresColdChain: 0,
      unitPrice: 550,
      costPrice: 420,
      currentStock: 100,
      reorderLevel: 20,
      minOrderQuantity: 10,
    },
  });

  // 9. Create Product Price History
  console.log("📊 Creating product price history...");
  await prisma.productPriceHistory.create({
    data: {
      productId: fullCreamMilk.id,
      unitPrice: 60,
      costPrice: 42,
      startDate: daysAgo(180),
      endDate: daysAgo(90),
    },
  });

  await prisma.productPriceHistory.create({
    data: {
      productId: fullCreamMilk.id,
      unitPrice: 65,
      costPrice: 45,
      startDate: daysAgo(90),
      endDate: null,
    },
  });

  // 10. Create Storage Locations
  console.log("🏭 Creating storage locations...");
  const coldRoom1 = await prisma.storageLocation.create({
    data: {
      name: "Cold Room A",
      type: "COLD_ROOM",
      capacity: 10000,
      currentLoad: 5500,
      tempMin: 2,
      tempMax: 6,
      currentTemp: 4,
      operational: 1,
    },
  });

  const coldRoom2 = await prisma.storageLocation.create({
    data: {
      name: "Cold Room B",
      type: "COLD_ROOM",
      capacity: 8000,
      currentLoad: 4200,
      tempMin: 2,
      tempMax: 6,
      currentTemp: 5,
      operational: 1,
    },
  });

  const freezer = await prisma.storageLocation.create({
    data: {
      name: "Freezer Unit 1",
      type: "FREEZER",
      capacity: 5000,
      currentLoad: 2000,
      tempMin: -18,
      tempMax: -15,
      currentTemp: -16,
      operational: 1,
    },
  });

  // 11. Create Production Batches
  console.log("🏭 Creating production batches...");
  const batch1 = await prisma.productionBatch.create({
    data: {
      batchNumber: "FCM-2024-001",
      productId: fullCreamMilk.id,
      producedQty: 1000,
      productionDate: daysAgo(2),
      manufacturingDate: daysAgo(2),
      expiryDate: daysFromNow(1),
      status: "COMPLETED",
      items: {
        create: {
          productId: fullCreamMilk.id,
          rawMilkUsedL: 1050,
          quantity: 1000,
        },
      },
    },
  });

  const batch2 = await prisma.productionBatch.create({
    data: {
      batchNumber: "TND-2024-001",
      productId: tonedMilk.id,
      producedQty: 1500,
      productionDate: daysAgo(1),
      manufacturingDate: daysAgo(1),
      expiryDate: daysFromNow(2),
      status: "COMPLETED",
      items: {
        create: {
          productId: tonedMilk.id,
          rawMilkUsedL: 1200,
          quantity: 1500,
        },
      },
    },
  });

  const batch3 = await prisma.productionBatch.create({
    data: {
      batchNumber: "CURD-2024-001",
      productId: curd.id,
      producedQty: 500,
      productionDate: daysAgo(1),
      manufacturingDate: daysAgo(1),
      expiryDate: daysFromNow(3),
      status: "COMPLETED",
      items: {
        create: {
          productId: curd.id,
          rawMilkUsedL: 520,
          quantity: 500,
        },
      },
    },
  });

  // 12. Create Inventory Stocks
  console.log("📦 Creating inventory stocks...");
  const stock1 = await prisma.inventoryStock.create({
    data: {
      productId: fullCreamMilk.id,
      batchId: batch1.id,
      storageLocationId: coldRoom1.id,
      quantity: 500,
      mfgDate: daysAgo(2),
      expiryDate: daysFromNow(1),
      createdAt: daysAgo(2),
    },
  });

  const stock2 = await prisma.inventoryStock.create({
    data: {
      productId: tonedMilk.id,
      batchId: batch2.id,
      storageLocationId: coldRoom1.id,
      quantity: 800,
      mfgDate: daysAgo(1),
      expiryDate: daysFromNow(2),
      createdAt: daysAgo(1),
    },
  });

  const stock3 = await prisma.inventoryStock.create({
    data: {
      productId: curd.id,
      batchId: batch3.id,
      storageLocationId: coldRoom2.id,
      quantity: 300,
      mfgDate: daysAgo(1),
      expiryDate: daysFromNow(3),
      createdAt: daysAgo(1),
    },
  });

  // 13. Create Inventory Transactions
  console.log("📝 Creating inventory transactions...");
  await prisma.inventoryTransaction.create({
    data: {
      stockId: stock1.id,
      type: "IN",
      qty: 500,
      referenceType: "ProductionBatch",
      referenceId: batch1.id,
      createdAt: daysAgo(2),
    },
  });

  await prisma.inventoryTransaction.create({
    data: {
      stockId: stock2.id,
      type: "IN",
      qty: 800,
      referenceType: "ProductionBatch",
      referenceId: batch2.id,
      createdAt: daysAgo(1),
    },
  });

  // 14. Create Quality Tests
  console.log("🔬 Creating quality tests...");
  await prisma.qualityTest.create({
    data: {
      testDate: daysAgo(2),
      testedById: qualityOfficer.id,
      targetType: "Batch",
      targetId: batch1.id,
      parameters: JSON.stringify({
        fatPercent: 6.2,
        snfPercent: 9.1,
        temperature: 4.5,
        pH: 6.7,
        microbialCount: 50000,
      }),
      outcome: "PASS",
      remarks: "All parameters within acceptable range",
    },
  });

  await prisma.qualityTest.create({
    data: {
      testDate: daysAgo(1),
      testedById: qualityOfficer.id,
      targetType: "Batch",
      targetId: batch2.id,
      parameters: JSON.stringify({
        fatPercent: 3.2,
        snfPercent: 8.6,
        temperature: 5.0,
        pH: 6.6,
        microbialCount: 45000,
      }),
      outcome: "PASS",
      remarks: "Quality standards met",
    },
  });

  // 15. Create Sales Inquiries
  console.log("📞 Creating sales inquiries...");
  const inquiry1 = await prisma.salesInquiry.create({
    data: {
      inquiryNumber: "INQ-2024-001",
      connectionId: customer1.id,
      productId: fullCreamMilk.id,
      quantity: 1000,
      quotedPrice: 65,
      status: "QUOTED",
      source: "EMAIL",
      createdAt: daysAgo(15),
    },
  });

  const inquiry2 = await prisma.salesInquiry.create({
    data: {
      inquiryNumber: "INQ-2024-002",
      connectionId: customer2.id,
      productId: tonedMilk.id,
      quantity: 2000,
      quotedPrice: 52,
      status: "CONVERTED",
      source: "PHONE",
      createdAt: daysAgo(10),
    },
  });

  // 16. Create Quotations
  console.log("💼 Creating quotations...");
  const quote1 = await prisma.quotation.create({
    data: {
      quoteRef: "QT-2024-001",
      connectionId: customer1.id,
      subtotal: 65000,
      gstCGST: 3250,
      gstSGST: 3250,
      discount: 1000,
      transportCharges: 500,
      coldChainCharges: 300,
      deliveryTerms: "FOB Warehouse",
      paymentTerms: "Net 30",
      status: "ACCEPTED",
      createdAt: daysAgo(14),
      lineItems: {
        create: [
          {
            productId: fullCreamMilk.id,
            qty: 1000,
            unitPrice: 65,
            totalPrice: 65000,
          },
        ],
      },
    },
  });

  const quote2 = await prisma.quotation.create({
    data: {
      quoteRef: "QT-2024-002",
      connectionId: customer2.id,
      subtotal: 104000,
      gstCGST: 5200,
      gstSGST: 5200,
      discount: 2000,
      transportCharges: 800,
      coldChainCharges: 500,
      deliveryTerms: "Delivered",
      paymentTerms: "Net 15",
      status: "ACCEPTED",
      createdAt: daysAgo(9),
      lineItems: {
        create: [
          {
            productId: tonedMilk.id,
            qty: 2000,
            unitPrice: 52,
            totalPrice: 104000,
          },
        ],
      },
    },
  });

  // 17. Create Sales Orders
  console.log("📋 Creating sales orders...");
  const order1 = await prisma.salesOrder.create({
    data: {
      orderRef: "SO-2024-001",
      connectionId: customer1.id,
      stage: "CONFIRMED",
      deliveryAddress: "Metro Supermarkets, 123 Main Street, Rajkot",
      distanceKm: 15,
      vehicleReq: "Refrigerated Van",
      createdAt: daysAgo(13),
      items: {
        create: [
          {
            productId: fullCreamMilk.id,
            qty: 1000,
            price: 65,
            batchId: batch1.id,
            mfgDate: daysAgo(2),
            expiryDate: daysFromNow(1),
          },
        ],
      },
    },
  });

  const order2 = await prisma.salesOrder.create({
    data: {
      orderRef: "SO-2024-002",
      connectionId: customer2.id,
      stage: "DELIVERED",
      deliveryAddress: "Fresh Mart Chain, 456 Commerce Road, Rajkot",
      distanceKm: 8,
      vehicleReq: "Refrigerated Truck",
      createdAt: daysAgo(8),
      items: {
        create: [
          {
            productId: tonedMilk.id,
            qty: 2000,
            price: 52,
            batchId: batch2.id,
            mfgDate: daysAgo(1),
            expiryDate: daysFromNow(2),
          },
        ],
      },
    },
  });

  const order3 = await prisma.salesOrder.create({
    data: {
      orderRef: "SO-2024-003",
      connectionId: customer3.id,
      stage: "PROCESSING",
      deliveryAddress: "Hotel Rajwada, 789 Palace Road, Rajkot",
      distanceKm: 5,
      vehicleReq: "Small Refrigerated Vehicle",
      createdAt: daysAgo(5),
      items: {
        create: [
          {
            productId: fullCreamMilk.id,
            qty: 100,
            price: 65,
            batchId: batch1.id,
            mfgDate: daysAgo(2),
            expiryDate: daysFromNow(1),
          },
          {
            productId: curd.id,
            qty: 50,
            price: 45,
            batchId: batch3.id,
            mfgDate: daysAgo(1),
            expiryDate: daysFromNow(3),
          },
        ],
      },
    },
  });

  // 18. Create Invoices
  console.log("🧾 Creating invoices...");
  const invoice1 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2024-001",
      salesOrderId: order1.id,
      dueDate: daysFromNow(30),
      totalAmount: 71300,
      paidAmount: 71300,
      status: "PAID",
      createdAt: daysAgo(13),
    },
  });

  const invoice2 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2024-002",
      salesOrderId: order2.id,
      dueDate: daysFromNow(15),
      totalAmount: 113700,
      paidAmount: 50000,
      status: "PARTIAL",
      createdAt: daysAgo(8),
    },
  });

  const invoice3 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2024-003",
      salesOrderId: order3.id,
      dueDate: daysFromNow(7),
      totalAmount: 8975,
      paidAmount: 0,
      status: "PENDING",
      createdAt: daysAgo(5),
    },
  });

  // 19. Create Payments
  console.log("💳 Creating payments...");
  await prisma.payment.create({
    data: {
      invoiceId: invoice1.id,
      amount: 71300,
      method: "BANK_TRANSFER",
      referenceNo: "TXN20241001",
      bankName: "HDFC Bank",
      paidAt: daysAgo(10),
      status: "COMPLETED",
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: invoice2.id,
      amount: 50000,
      method: "CHEQUE",
      referenceNo: "CHQ789456",
      bankName: "ICICI Bank",
      paidAt: daysAgo(5),
      status: "COMPLETED",
    },
  });

  // 20. Create Delivery Challans
  console.log("🚚 Creating delivery challans...");
  await prisma.deliveryChallan.create({
    data: {
      challanNumber: "DC-2024-001",
      salesOrderId: order1.id,
      vehicleNumber: "GJ-03-AB-1234",
      driverName: "Rakesh Kumar",
      driverPhone: "+91 98765 12345",
      tempInitialC: 4.5,
      tempFinalC: 5.2,
      signedBy: "Vikram Singh",
      deliveredAt: daysAgo(12),
    },
  });

  await prisma.deliveryChallan.create({
    data: {
      challanNumber: "DC-2024-002",
      salesOrderId: order2.id,
      vehicleNumber: "GJ-03-CD-5678",
      driverName: "Mahesh Patel",
      driverPhone: "+91 98765 23456",
      tempInitialC: 5.0,
      tempFinalC: 5.8,
      signedBy: "Neha Gupta",
      deliveredAt: daysAgo(7),
    },
  });

  // 21. Create Purchase Orders
  console.log("📦 Creating purchase orders...");
  await prisma.purchaseOrder.create({
    data: {
      poRef: "PO-2024-001",
      type: "PACKAGING",
      supplierId: supplier1.id,
      expectedDate: daysFromNow(7),
      createdAt: daysAgo(10),
      items: {
        create: [
          {
            description: "Milk pouches 1L - 10000 pcs",
            qty: 10000,
            unitPrice: 2.5,
          },
          {
            description: "Curd cups 500g - 5000 pcs",
            qty: 5000,
            unitPrice: 3.0,
          },
        ],
      },
    },
  });

  // 22. Create Bills
  console.log("💵 Creating bills...");
  await prisma.bill.create({
    data: {
      billNumber: "BILL-2024-001",
      supplierId: supplier1.id,
      dueDate: daysFromNow(7),
      amount: 735000,
      paidAmount: 735000,
      status: "PAID",
    },
  });

  await prisma.bill.create({
    data: {
      billNumber: "BILL-2024-002",
      supplierId: supplier2.id,
      dueDate: daysFromNow(5),
      amount: 432000,
      paidAmount: 0,
      status: "PENDING",
    },
  });

  // 23. Create Support Tickets
  console.log("🎫 Creating support tickets...");
  const ticket1 = await prisma.supportTicket.create({
    data: {
      ticketNumber: "TKT-2024-001",
      connectionId: customer1.id,
      issueType: "QUALITY_ISSUE",
      priority: "HIGH",
      status: "RESOLVED",
      createdAt: daysAgo(20),
    },
  });

  const ticket2 = await prisma.supportTicket.create({
    data: {
      ticketNumber: "TKT-2024-002",
      connectionId: customer2.id,
      issueType: "DELIVERY_DELAY",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
      createdAt: daysAgo(5),
    },
  });

  // 24. Create Ticket Comments
  console.log("💬 Creating ticket comments...");
  await prisma.ticketComment.create({
    data: {
      ticketId: ticket1.id,
      authorId: salesRep1.id,
      content:
        "Customer reported slight temperature variation in delivered products.",
      isInternal: 0,
      createdAt: daysAgo(20),
    },
  });

  await prisma.ticketComment.create({
    data: {
      ticketId: ticket1.id,
      authorId: qualityOfficer.id,
      content:
        "Investigated the issue. Found temperature control malfunction in delivery vehicle.",
      isInternal: 1,
      createdAt: daysAgo(19),
    },
  });

  await prisma.ticketComment.create({
    data: {
      ticketId: ticket1.id,
      authorId: salesRep1.id,
      content:
        "Issue resolved. Replaced products and serviced vehicle. Customer satisfied.",
      isInternal: 0,
      createdAt: daysAgo(18),
    },
  });

  await prisma.ticketComment.create({
    data: {
      ticketId: ticket2.id,
      authorId: salesRep1.id,
      content:
        "Delivery delayed due to vehicle breakdown. Arranging alternate transport.",
      isInternal: 0,
      createdAt: daysAgo(5),
    },
  });

  // 25. Create Supplier Feedback
  console.log("📝 Creating supplier feedback...");
  await prisma.supplierFeedback.create({
    data: {
      supplierId: supplier1.id,
      feedbackType: "QUALITY",
      details: "Consistently high quality milk supply",
      resolved: 1,
    },
  });

  await prisma.supplierFeedback.create({
    data: {
      supplierId: supplier2.id,
      feedbackType: "TIMING",
      details: "Occasional delays in evening collection",
      resolved: 0,
    },
  });

  // 26. Create Activities
  console.log("📊 Creating activities...");
  await prisma.activity.create({
    data: {
      userId: salesRep1.id,
      type: "CALL",
      notes:
        "Follow-up call with Metro Supermarkets regarding new product line",
      relatedType: "Connection",
      relatedId: customer1.id,
      createdAt: daysAgo(3),
    },
  });

  await prisma.activity.create({
    data: {
      userId: procurementOfficer.id,
      type: "VISIT",
      notes: "Site visit to Green Valley Dairy Farm for quality assessment",
      relatedType: "Connection",
      relatedId: supplier1.id,
      createdAt: daysAgo(7),
    },
  });

  await prisma.activity.create({
    data: {
      userId: salesManager.id,
      type: "MEETING",
      notes: "Strategic planning meeting with Fresh Mart Chain management",
      relatedType: "Connection",
      relatedId: customer2.id,
      createdAt: daysAgo(10),
    },
  });

  // 27. Create Documents
  console.log("📄 Creating documents...");
  await prisma.document.create({
    data: {
      name: "FSSAI Certificate - Green Valley",
      path: "/documents/fssai/green_valley_cert.pdf",
      category: "COMPLIANCE",
      relatedType: "Connection",
      relatedId: supplier1.id,
      uploadedById: procurementOfficer.id,
      uploadedAt: daysAgo(100),
    },
  });

  await prisma.document.create({
    data: {
      name: "Sales Agreement - Metro Supermarkets",
      path: "/documents/contracts/metro_agreement.pdf",
      category: "CONTRACT",
      relatedType: "Connection",
      relatedId: customer1.id,
      uploadedById: salesManager.id,
      uploadedAt: daysAgo(150),
    },
  });

  await prisma.document.create({
    data: {
      name: "Quality Test Report - Batch FCM-2024-001",
      path: "/documents/quality/batch_fcm_2024_001.pdf",
      category: "QUALITY",
      relatedType: "ProductionBatch",
      relatedId: batch1.id,
      uploadedById: qualityOfficer.id,
      uploadedAt: daysAgo(2),
    },
  });

  // 28. Create Notifications
  console.log("🔔 Creating notifications...");
  await prisma.notification.create({
    data: {
      userId: salesRep1.id,
      title: "New Order Received",
      body: "Order SO-2024-003 from Hotel Rajwada requires attention",
      isRead: 1,
      createdAt: daysAgo(5),
    },
  });

  await prisma.notification.create({
    data: {
      userId: procurementOfficer.id,
      title: "Low Stock Alert",
      body: "Raw milk stock running low. Schedule procurement.",
      isRead: 0,
      createdAt: daysAgo(1),
    },
  });

  await prisma.notification.create({
    data: {
      userId: qualityOfficer.id,
      title: "Quality Test Pending",
      body: "Batch TND-2024-001 awaiting quality inspection",
      isRead: 1,
      createdAt: daysAgo(1),
    },
  });

  await prisma.notification.create({
    data: {
      userId: salesManager.id,
      title: "Payment Received",
      body: "Payment of ₹71,300 received for Invoice INV-2024-001",
      isRead: 1,
      createdAt: daysAgo(10),
    },
  });

  // 29. Create Sales Targets
  console.log("🎯 Creating sales targets...");
  await prisma.salesTarget.create({
    data: {
      userId: salesManager.id,
      period: "2024-Q4",
      amount: 5000000,
      achieved: 3200000,
    },
  });

  await prisma.salesTarget.create({
    data: {
      userId: salesRep1.id,
      period: "2024-Q4",
      amount: 2000000,
      achieved: 1500000,
    },
  });

  // 30. Create Commission Rules
  console.log("💰 Creating commission rules...");
  await prisma.commissionRule.create({
    data: {
      productCategory: "MILK",
      minAmount: 0,
      maxAmount: 100000,
      percentage: 2.0,
    },
  });

  await prisma.commissionRule.create({
    data: {
      productCategory: "MILK",
      minAmount: 100000,
      maxAmount: null,
      percentage: 3.0,
    },
  });

  await prisma.commissionRule.create({
    data: {
      productCategory: "CURD",
      minAmount: 0,
      maxAmount: null,
      percentage: 2.5,
    },
  });

  // 31. Create Commissions
  console.log("💵 Creating commissions...");
  await prisma.commission.create({
    data: {
      userId: salesRep1.id,
      orderId: order1.id,
      amount: 2139,
      paidStatus: "PAID",
    },
  });

  await prisma.commission.create({
    data: {
      userId: salesRep1.id,
      orderId: order2.id,
      amount: 3411,
      paidStatus: "PENDING",
    },
  });

  // 32. Create Audit Logs
  console.log("📝 Creating audit logs...");
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: "CREATE",
      entity: "User",
      entityId: salesRep1.id,
      meta: JSON.stringify({ role: "SALES", department: "Sales" }),
      createdAt: daysAgo(120),
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: salesManager.id,
      action: "UPDATE",
      entity: "SalesOrder",
      entityId: order1.id,
      meta: JSON.stringify({
        field: "stage",
        oldValue: "PROCESSING",
        newValue: "CONFIRMED",
      }),
      createdAt: daysAgo(13),
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: procurementOfficer.id,
      action: "CREATE",
      entity: "MilkProcurementEntry",
      meta: JSON.stringify({ supplier: supplier1.id, quantity: 500 }),
      createdAt: daysAgo(1),
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: qualityOfficer.id,
      action: "CREATE",
      entity: "QualityTest",
      entityId: batch1.id,
      meta: JSON.stringify({ outcome: "PASS", batch: batch1.batchNumber }),
      createdAt: daysAgo(2),
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log("- Roles: 6");
  console.log("- Departments: 5");
  console.log("- Users: 6");
  console.log("- Connections: 5 (2 suppliers, 3 customers)");
  console.log("- Products: 6");
  console.log("- Production Batches: 3");
  console.log("- Milk Collection Centers: 2");
  console.log("- Milk Procurement Entries: ~90 (30 days of data)");
  console.log("- Sales Orders: 3");
  console.log("- Invoices: 3");
  console.log("- Support Tickets: 2");
  console.log("- And much more...");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
