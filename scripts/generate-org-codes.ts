/**
 * Script to generate organization codes for existing organizations
 * Run this after adding the code field to the schema
 * Usage: npx tsx scripts/generate-org-codes.ts
 */

import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars (0, O, I, 1)

function generateCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function generateUniqueOrgCode(): Promise<string> {
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const code = generateCode();

    const existing = await prisma.organization.findUnique({
      where: { code },
      select: { id: true },
    });

    if (!existing) {
      return code;
    }

    attempts++;
  }

  // Fallback: use timestamp-based code
  return `ORG${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

async function main() {
  console.log("🔧 Generating organization codes for existing organizations...");

  const organizations = await prisma.organization.findMany({
    where: {
      code: null,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (organizations.length === 0) {
    console.log("✅ All organizations already have codes.");
    return;
  }

  console.log(`📝 Found ${organizations.length} organizations without codes.`);

  for (const org of organizations) {
    const code = await generateUniqueOrgCode();
    await prisma.organization.update({
      where: { id: org.id },
      data: { code },
    });
    console.log(`✅ Generated code ${code} for ${org.name}`);
  }

  console.log("✨ Done! All organizations now have codes.");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

