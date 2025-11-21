# Signup 500 Error - Possible Issues and Reasons

## Critical Issues (Most Likely Causes)

### 1. **Interactive Transactions Not Supported by D1** ⚠️ **HIGHEST PRIORITY**
**Issue**: Cloudflare D1 does NOT support interactive transactions (`prisma.$transaction` with callback function).

**Location**: `src/app/api/auth/signup/route.ts` lines 212, 248

**Code Problem**:
```typescript
result = await prisma.$transaction(async (tx) => {
  // Multiple operations inside transaction
});
```

**Why it fails**: 
- D1 only supports batch transactions (multiple queries in a single batch)
- Interactive transactions require multiple round-trips and state management
- D1 is a distributed SQLite database with different transaction semantics

**Solution**: Refactor to use sequential operations or batch transactions

---

### 2. **Missing or Invalid Cloudflare Environment Variables**
**Issue**: Missing or incorrect D1 API credentials

**Required Variables**:
- `CLOUDFLARE_D1_TOKEN` - API token for D1 access
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `CLOUDFLARE_DATABASE_ID` - Your D1 database ID (should be `bdc3405b-6cf3-450b-9030-11c263c02cde`)

**Location**: `config.ts` and `.env` file

**Why it fails**:
- PrismaD1 adapter cannot authenticate with Cloudflare API
- Connection initialization fails
- All database operations fail

**How to check**:
```bash
# Verify environment variables are set
echo $CLOUDFLARE_D1_TOKEN
echo $CLOUDFLARE_ACCOUNT_ID
echo $CLOUDFLARE_DATABASE_ID
```

---

### 3. **Prisma Client Not Generated or Outdated**
**Issue**: Prisma client might not be generated or is out of sync with schema

**Location**: `src/generated/prisma/`

**Why it fails**:
- Missing generated client code
- Schema changes not reflected in client
- Type mismatches

**How to check**:
```bash
# Check if generated client exists
ls src/generated/prisma/

# Regenerate if needed
npx prisma generate
```

**Note**: Previous attempts to generate failed due to file locks on Windows

---

### 4. **Database Schema Mismatch**
**Issue**: Database tables don't exist or schema doesn't match Prisma schema

**Why it fails**:
- Tables not created in D1
- Column types don't match
- Foreign key constraints fail
- Missing indexes

**How to check**:
```bash
# Check D1 database info
npx wrangler d1 info flavi-crm-next

# Verify tables exist
npx wrangler d1 execute flavi-crm-next --remote --command "SELECT name FROM sqlite_master WHERE type='table';"
```

---

## Secondary Issues (Less Likely but Possible)

### 5. **Network/API Connection Issues**
**Issue**: Cannot reach Cloudflare D1 API

**Why it fails**:
- Network connectivity problems
- Cloudflare API rate limiting
- API endpoint changes
- Firewall blocking requests

**Symptoms**: Timeout errors, connection refused

---

### 6. **Missing Required Fields in Database**
**Issue**: Database constraints not satisfied

**Why it fails**:
- Required fields (NOT NULL) not provided
- Foreign key constraints fail
- Unique constraint violations (email already exists)

**Location**: Prisma schema constraints

**Example**: If `UserProfile` requires certain fields that aren't being created

---

### 7. **Data Type Mismatches**
**Issue**: Data types don't match schema expectations

**Why it fails**:
- Unix timestamps (Int) vs Date objects
- Boolean values (0/1) vs true/false
- String vs Int type mismatches

**Location**: `src/app/api/auth/signup/route.ts` line 156
```typescript
const currentTime = Math.floor(Date.now() / 1000); // Unix seconds
```

**Note**: Code correctly uses Unix timestamps, but verify all fields match

---

### 8. **Email Service Configuration (Non-Critical)**
**Issue**: Resend API key missing or invalid

**Location**: `src/lib/email.ts`

**Why it fails**: 
- Email sending fails (but shouldn't cause 500)
- Error is caught and logged, signup should still succeed

**Note**: This is handled gracefully in the code

---

### 9. **Rate Limiting Issues**
**Issue**: In-memory rate limiting might have issues

**Location**: `src/lib/rate-limit.ts`

**Why it fails**:
- Unlikely to cause 500 error
- Would return 429 status instead

---

## Debugging Steps

### Step 1: Check Server Logs
Look at the actual error message in the terminal output. The error should be logged at:
```typescript
console.error("Signup error:", error); // Line 343 in route.ts
```

### Step 2: Verify Environment Variables
```bash
# Check .env file exists and has all required variables
cat .env | grep CLOUDFLARE
```

### Step 3: Test Database Connection
```typescript
// Add this test endpoint
// GET /api/test-db
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

### Step 4: Check Transaction Support
The most likely issue is the interactive transaction. Test with a simple query first:
```typescript
// Test simple query
const user = await prisma.user.findFirst();
```

---

## Recommended Fix Priority

1. **FIRST**: Remove or refactor `prisma.$transaction` calls (Issue #1)
2. **SECOND**: Verify all environment variables are set (Issue #2)
3. **THIRD**: Verify Prisma client is generated (Issue #3)
4. **FOURTH**: Verify database schema matches (Issue #4)

---

## Quick Fix for Transaction Issue

Replace interactive transactions with sequential operations:

**Before** (Interactive Transaction):
```typescript
result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({...});
  await tx.verificationToken.create({...});
  return { user };
});
```

**After** (Sequential Operations):
```typescript
const user = await prisma.user.create({...});
await prisma.verificationToken.create({...});
result = { user };
```

**Note**: This loses atomicity, but D1 doesn't support interactive transactions anyway. For true atomicity, you'd need to use batch transactions or restructure the operations.

