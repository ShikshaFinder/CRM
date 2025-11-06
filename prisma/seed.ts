import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding roles and departments...')

  const roles = [
    'Admin',
    'Sales Manager',
    'Sales Executive',
    'Production Manager',
    'Quality Officer',
    'Procurement Officer',
    'Warehouse Manager'
  ]

  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name }
    })
  }

  const departments = [
    'Sales',
    'Production',
    'Quality',
    'Procurement',
    'Warehouse',
    'Admin'
  ]

  for (const name of departments) {
    await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name }
    })
  }

  console.log('Seeding sample admin user...')
  const adminEmail = 'admin@flavi.local'
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: 'changeme',
      isActive: true,
      profile: {
        create: {
          fullName: 'System Admin',
          phone: '0000000000',
          roleTitle: 'Admin'
        }
      }
    }
  })

  const adminRole = await prisma.role.findUnique({ where: { name: 'Admin' } })
  if (adminRole) {
    await prisma.userRole.upsert({
      where: { id: `${admin.id}-${adminRole.id}` },
      update: {},
      create: {
        id: `${admin.id}-${adminRole.id}`,
        userId: admin.id,
        roleId: adminRole.id
      }
    })
  }

  console.log('Seeding sample connection types and a sample supplier...')
  let conn = await prisma.connection.findFirst({
    where: { name: 'Sample Dairy Supplier' }
  })
  
  if (!conn) {
    conn = await prisma.connection.create({
      data: {
        name: 'Sample Dairy Supplier',
        type: 'MILK_SUPPLIER',
        businessCategory: 'B2B',
        gstNumber: 'GSTIN0000',
        creditLimit: 50000
      }
    })
  }

  await prisma.contactPerson.upsert({
    where: { id: `${conn.id}-primary` },
    update: {},
    create: {
      id: `${conn.id}-primary`,
      connectionId: conn.id,
      fullName: 'Primary Contact',
      email: 'supplier@sample.local',
      phone: '9999999999',
      isPrimary: true
    }
  })

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
