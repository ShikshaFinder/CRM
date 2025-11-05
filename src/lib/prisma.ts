import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { config } from "../../config";

declare global {
  // allow global `var` in dev to preserve PrismaClient across module reloads
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma;

if (!global.prisma) {
  const adapter = new PrismaD1({
    CLOUDFLARE_D1_TOKEN: config.cloudflare.d1_token,
    CLOUDFLARE_ACCOUNT_ID: config.cloudflare.account_id,
    CLOUDFLARE_DATABASE_ID: config.cloudflare.db_id,
  });

  globalThis.prisma = new PrismaClient({ adapter } as any);
}

prisma = global.prisma;

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
