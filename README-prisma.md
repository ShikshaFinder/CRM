# Prisma setup for Flavi CRM (Dairy)

This file explains how to set up the Prisma schema and seed data for the Dairy CRM.

Prerequisites
- Node.js and npm
- A PostgreSQL database (or another provider supported by Prisma if you update `schema.prisma`)

Steps

1. Set DATABASE_URL in your environment (PowerShell example):

```powershell
$env:DATABASE_URL = "postgresql://user:password@localhost:5432/flavi_db?schema=public"
```

2. Install dependencies:

```powershell
npm install
# If you didn't add deps to package.json, run:
# npm install prisma @prisma/client ts-node -D
# npm install @prisma/client
```

3. Generate Prisma client:

```powershell
npm run prisma:generate
```

4. Run migrations (creates migration and applies to DB):

```powershell
npm run prisma:migrate
# follow prompts
```

5. Seed the database:

```powershell
npm run prisma:seed
```

6. Open Prisma Studio to inspect data:

```powershell
npm run prisma:studio
```

Notes
- The seed script uses a plaintext password `changeme` for the sample admin. Replace with a secure hashed password in production.
- Schema located at `prisma/schema.prisma`. It contains models for users, connections, product catalog, procurement, production, inventory, sales pipeline, purchases, support, analytics, and audit logs.

Next steps
- Add API routes in Next.js that use Prisma client (`@prisma/client`) to implement CRUD and business logic.
- Implement authentication & password hashing (bcrypt / argon2).
- Add type-safe input validation (zod) and authorization checks.