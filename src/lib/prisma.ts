import { PrismaD1 } from "@prisma/adapter-d1";
import { config } from "../../config";
import { PrismaClient } from "@/generated/prisma";

// Extend the global scope so TypeScript knows about `globalThis.prisma`
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Re-use PrismaClient across hot-reloads in dev
const prisma =
  globalThis.prisma ??
  (() => {
    const adapter = new PrismaD1({
      CLOUDFLARE_D1_TOKEN: config.cloudflare.d1_token,
      CLOUDFLARE_ACCOUNT_ID: config.cloudflare.account_id,
      CLOUDFLARE_DATABASE_ID: config.cloudflare.db_id,
    });

    return new PrismaClient({ adapter } as any);
  })();

// Cache the instance globally in dev mode
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;
