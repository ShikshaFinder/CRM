# Migration Instructions for Organization Code

## Issue: Database Locked

If you're getting a "database is locked" error, follow these steps:

### Step 1: Stop All Processes
1. **Stop the Next.js dev server**: Press `Ctrl+C` in the terminal where `npm run dev` is running
2. **Close Prisma Studio**: Close any browser tabs with Prisma Studio open
3. **Close any database tools**: Close DB Browser, SQLite tools, etc.

### Step 2: Apply Migration

**Option A: Automatic (Recommended)**
```powershell
npx prisma migrate dev
```

**Option B: Manual SQL (If automatic fails)**
```powershell
# If you have sqlite3 installed
sqlite3 prisma/dev.db < scripts/apply-org-code-migration.sql

# Or use the generate script after migration
npx tsx scripts/generate-org-codes.ts
```

### Step 3: Generate Prisma Client
```powershell
npx prisma generate
```

### Step 4: Verify
Check that organizations have codes:
```powershell
npx prisma studio
# Navigate to Organization table and verify 'code' column exists
```

## What This Migration Does

1. Adds a `code` field to the `Organization` table (6-character unique alphanumeric)
2. Generates codes for existing organizations
3. Creates a unique index on the `code` field

## After Migration

- New organizations will automatically get codes when created
- Existing organizations will have codes generated
- Users can join organizations using the organization code + invite code

