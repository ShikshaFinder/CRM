-- AlterTable: Add code column (nullable first to allow population)
ALTER TABLE "Organization" ADD COLUMN "code" TEXT;

-- Generate unique codes for existing organizations
-- Using a simple approach: random 6-char alphanumeric (excluding confusing chars)
-- Note: For better uniqueness, run the generate-org-codes.ts script after migration
UPDATE "Organization" 
SET "code" = upper(substr(hex(randomblob(4)), 1, 6))
WHERE "code" IS NULL;

-- For any remaining NULL codes (edge case), use a timestamp-based fallback
UPDATE "Organization"
SET "code" = 'ORG' || upper(substr(CAST((julianday('now') * 86400000) AS TEXT), -6))
WHERE "code" IS NULL;

-- Create unique index
CREATE UNIQUE INDEX IF NOT EXISTS "Organization_code_key" ON "Organization"("code");
