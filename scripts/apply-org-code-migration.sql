-- Manual migration script for adding organization code
-- Run this if the automatic migration fails due to database lock
-- Usage: sqlite3 prisma/dev.db < scripts/apply-org-code-migration.sql

-- Add code column (nullable first)
ALTER TABLE "Organization" ADD COLUMN "code" TEXT;

-- Generate unique codes for existing organizations
-- Using a simple approach: random 6-char alphanumeric
UPDATE "Organization" 
SET "code" = upper(substr(hex(randomblob(4)), 1, 6))
WHERE "code" IS NULL;

-- For any remaining NULL codes (edge case), use a timestamp-based fallback
UPDATE "Organization"
SET "code" = 'ORG' || upper(substr(CAST((julianday('now') * 86400000) AS TEXT), -6))
WHERE "code" IS NULL;

-- Create unique index
CREATE UNIQUE INDEX IF NOT EXISTS "Organization_code_key" ON "Organization"("code");

-- Verify: Check that all organizations have codes
SELECT COUNT(*) as total, COUNT(code) as with_codes FROM "Organization";

