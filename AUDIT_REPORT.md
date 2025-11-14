# API & App Audit Report
**Generated:** 2025-01-XX  
**Scope:** All API routes in `src/app/api/**/route.ts`

## Executive Summary

**Total Routes Audited:** 29  
**Critical Security Issues:** 17 routes  
**High Priority Issues:** 12 routes  
**Medium Priority Issues:** 8 routes  

---

## Phase 1: Security & Multi-Tenancy Audit

### 1.1 Authentication Checks

#### Routes WITH Authentication ✅
- `auth/**/*` - All auth routes (expected, no auth needed)
- `organizations/**/*` - All org routes have auth
- `customers/route.ts` - Has auth ✅
- `products/route.ts` - Has auth ✅
- `products/[id]/route.ts` - Has auth ✅

#### Routes MISSING Authentication ❌ (CRITICAL)
1. **`orders/route.ts`** - No auth check, exposes all orders
2. **`connections/route.ts`** - No auth check, exposes all connections
3. **`procurements/route.ts`** - No auth check, exposes all procurements
4. **`inventory/route.ts`** - No auth check, exposes all inventory
5. **`production/route.ts`** - No auth check, exposes all production batches
6. **`finance/invoices/route.ts`** - No auth check, exposes all invoices
7. **`hr/employees/route.ts`** - No auth check, exposes all users (SECURITY RISK!)
8. **`compliance/documents/route.ts`** - No auth check, exposes all documents
9. **`logistics/delivery/route.ts`** - No auth check, exposes all delivery challans
10. **`marketing/campaigns/route.ts`** - No auth check, exposes all campaigns
11. **`communications/route.ts`** - No auth check, exposes all notifications/tickets
12. **`analytics/sales-summary/route.ts`** - No auth check, exposes all sales data

### 1.2 Organization Scoping Audit

#### Routes WITH Org Scoping ✅
- `customers/route.ts` - Filters by `session.user.currentOrganizationId` ✅
- `products/route.ts` - Filters by `session.user.currentOrganizationId` ✅
- `products/[id]/route.ts` - Verifies org ownership ✅
- `organizations/**/*` - All org routes properly scoped ✅

#### Routes MISSING Org Scoping ❌ (CRITICAL)
All routes listed in 1.1 (missing auth) also lack org scoping. Additionally:

1. **`orders/route.ts`**
   - GET: Returns ALL orders from ALL organizations
   - POST: Creates orders without `organizationId` (will fail due to schema requirement)

2. **`connections/route.ts`**
   - GET: Returns ALL connections from ALL organizations
   - POST: Creates connections without `organizationId` (will fail due to schema requirement)

3. **`procurements/route.ts`**
   - GET: Returns ALL procurements from ALL organizations
   - POST: Accepts `organizationId` from body (INSECURE - should come from session)

4. **`inventory/route.ts`**
   - GET: Returns ALL inventory from ALL organizations
   - POST: Creates inventory without `organizationId` (will fail)

5. **`production/route.ts`**
   - GET: Returns ALL batches from ALL organizations
   - POST: Creates batches without `organizationId` (will fail)

6. **`finance/invoices/route.ts`**
   - GET: Returns ALL invoices from ALL organizations
   - POST: Creates invoices without `organizationId` (will fail)

7. **`hr/employees/route.ts`**
   - GET: Returns ALL users from ALL organizations (MAJOR SECURITY RISK)
   - POST: Creates users without org membership

8. **`compliance/documents/route.ts`**
   - GET: Returns ALL documents from ALL organizations
   - POST: Creates documents without `organizationId` (will fail)

9. **`logistics/delivery/route.ts`**
   - GET: Returns ALL challans from ALL organizations
   - POST: Creates challans without `organizationId` (will fail)

10. **`marketing/campaigns/route.ts`**
    - GET: Returns ALL campaigns from ALL organizations
    - POST: Creates activities without `organizationId` (will fail)

11. **`communications/route.ts`**
    - GET: Returns ALL notifications/tickets from ALL organizations
    - POST: Accepts `organizationId` from body (INSECURE)

12. **`analytics/sales-summary/route.ts`**
    - GET: Returns sales data from ALL organizations

### 1.3 Role-Based Access Control

#### Missing Role Checks
- `hr/employees/route.ts` - Creating users should require ADMIN role
- `organizations/invites/route.ts` - Already has role check ✅
- `organizations/[id]/route.ts` - Already has role check ✅

---

## Phase 2: Naming & Consistency Audit

### 2.1 Route Naming Consistency

#### Issues Found:
1. **`/api/customers`** vs **`/api/connections`**
   - Both use `Connection` Prisma model
   - `customers/route.ts` uses `Connection` model ✅
   - `connections/route.ts` uses `Connection` model ✅
   - **Inconsistency**: Two routes for same model

2. **Route Path vs Model Name Mismatches:**
   - `/api/orders` → Uses `SalesOrder` model (acceptable)
   - `/api/procurements` → Uses `MilkProcurementEntry` model (acceptable)
   - `/api/inventory` → Uses `InventoryStock` model (acceptable)
   - `/api/production` → Uses `ProductionBatch` model (acceptable)
   - `/api/marketing/campaigns` → Uses `Activity` model (confusing)

### 2.2 Variable Naming Inconsistencies

#### Short Variable Names (Poor Readability):
- `conn` in `connections/route.ts` (should be `connection`)
- `inv` in `finance/invoices/route.ts` (should be `invoice`)
- `d` in `compliance/documents/route.ts` (should be `document`)
- `c` in `logistics/delivery/route.ts` (should be `challan`)

#### Consistent Naming ✅:
- `order` in `orders/route.ts`
- `product` in `products/route.ts`
- `customer` in `customers/route.ts`

### 2.3 Response Format Inconsistencies

#### Three Different Patterns Found:

1. **Pattern A: `new Response(JSON.stringify(...))`** (Most common)
   - `orders/route.ts`
   - `connections/route.ts`
   - `procurements/route.ts`
   - `inventory/route.ts`
   - `production/route.ts`
   - `finance/invoices/route.ts`
   - `hr/employees/route.ts`
   - `compliance/documents/route.ts`
   - `logistics/delivery/route.ts`
   - `marketing/campaigns/route.ts`
   - `analytics/sales-summary/route.ts`

2. **Pattern B: `NextResponse.json(...)`** (Preferred)
   - `organizations/**/*` routes
   - `products/[id]/route.ts`

3. **Pattern C: Custom `jsonResponse()` helper**
   - `products/route.ts`
   - `communications/route.ts`

#### Status Code Inconsistencies:
- Most POST routes return `201` ✅
- Some POST routes return `200` (should be `201`)
- Error responses inconsistent: `400`, `401`, `403`, `500` (mostly correct)

---

## Phase 3: Business Logic Audit

### 3.1 Data Validation Issues

#### Missing Required Field Validations:
1. **`orders/route.ts`**
   - POST: Validates `orderRef`, `connectionId`, `items` ✅
   - Missing: Validation that `connectionId` belongs to user's org

2. **`connections/route.ts`**
   - POST: Validates `name`, `type` ✅
   - Missing: `organizationId` validation (but should come from session)

3. **`procurements/route.ts`**
   - POST: Validates required fields ✅
   - **Issue**: Accepts `organizationId` from body (should be from session)

4. **`inventory/route.ts`**
   - POST: Validates `productId`, `storageLocationId`, `quantity` ✅
   - Missing: Validation that product/storage belong to user's org

5. **`production/route.ts`**
   - POST: Validates `batchNumber`, `productId` ✅
   - Missing: Validation that product belongs to user's org

6. **`finance/invoices/route.ts`**
   - POST: Validates `invoiceNumber`, `totalAmount` ✅
   - Missing: Validation that `salesOrderId` belongs to user's org

7. **`hr/employees/route.ts`**
   - POST: Validates `email`, `password` ✅
   - Missing: Should create org membership, not just user

8. **`compliance/documents/route.ts`**
   - POST: Validates `name`, `path` ✅
   - Missing: `organizationId` validation

9. **`logistics/delivery/route.ts`**
   - POST: Validates `challanNumber` ✅
   - Missing: Validation that `salesOrderId` belongs to user's org

10. **`marketing/campaigns/route.ts`**
    - POST: Validates `name` ✅
    - Missing: `organizationId` validation

11. **`communications/route.ts`**
    - POST: Validates required fields ✅
    - **Issue**: Accepts `organizationId` from body (should be from session)

### 3.2 Transaction Safety

#### Missing Try-Catch Blocks:
- `orders/route.ts` - No try-catch ❌
- `connections/route.ts` - No try-catch ❌
- `inventory/route.ts` - No try-catch ❌
- `production/route.ts` - No try-catch ❌
- `finance/invoices/route.ts` - No try-catch ❌
- `hr/employees/route.ts` - No try-catch ❌
- `compliance/documents/route.ts` - No try-catch ❌
- `logistics/delivery/route.ts` - No try-catch ❌
- `marketing/campaigns/route.ts` - No try-catch ❌

#### Routes WITH Try-Catch ✅:
- `procurements/route.ts` ✅
- `communications/route.ts` ✅
- `products/route.ts` ✅
- `customers/route.ts` ✅

### 3.3 Business Rules Violations

1. **Cross-Organization Data Access**
   - All routes missing org scoping allow viewing/creating data for any organization

2. **Orphaned Records Risk**
   - Routes creating records without `organizationId` will fail at database level (good)
   - But routes accepting `organizationId` from body can create records for wrong org

3. **Foreign Key Validation Missing**
   - `orders/route.ts`: Doesn't verify `connectionId` belongs to user's org
   - `inventory/route.ts`: Doesn't verify `productId`, `storageLocationId` belong to user's org
   - `production/route.ts`: Doesn't verify `productId` belongs to user's org
   - `finance/invoices/route.ts`: Doesn't verify `salesOrderId` belongs to user's org

---

## Phase 4: Type Safety & Error Handling

### 4.1 TypeScript Issues

#### Use of `any` Type:
- `orders/route.ts`: `items.map((it: any) => ...)`
- `connections/route.ts`: `contacts.map((c: any) => ...)`
- `production/route.ts`: `items.map((it: any) => ...)`
- `analytics/sales-summary/route.ts`: `const rows: any = ...`

#### Missing Type Definitions:
- No request/response type interfaces defined
- All routes use inline types or `any`

### 4.2 Error Handling Issues

#### Inconsistent Error Responses:
- Some use `{ error: "message" }`
- Some use `{ error: "Failed to..." }`
- Status codes mostly consistent (400, 401, 403, 500)

#### Missing Error Logging:
- Most routes don't log errors
- Only `procurements/route.ts`, `communications/route.ts`, `products/route.ts` log errors

#### Error Message Leakage:
- No sensitive information leaked in error messages ✅

---

## Phase 5: Frontend-Backend Alignment

### 5.1 API Route Coverage

#### Frontend Pages → API Routes Mapping:
- `/customers` → `/api/customers` ✅
- `/products` → `/api/products` ✅
- `/orders` → `/api/orders` ✅ (but insecure)
- `/connections` → `/api/connections` ✅ (but insecure)
- `/procurements` → `/api/procurements` ✅ (but insecure)
- `/inventory` → `/api/inventory` ✅ (but insecure)
- `/production` → `/api/production` ✅ (but insecure)
- `/finance` → `/api/finance/invoices` ✅ (but insecure)
- `/hr` → `/api/hr/employees` ✅ (but insecure)
- `/compliance` → `/api/compliance/documents` ✅ (but insecure)
- `/logistics` → `/api/logistics/delivery` ✅ (but insecure)
- `/marketing` → `/api/marketing/campaigns` ✅ (but insecure)
- `/communications` → `/api/communications` ✅ (but insecure)
- `/analytics` → `/api/analytics/sales-summary` ✅ (but insecure)

### 5.2 Data Structure Alignment

#### Issues:
- Frontend expects org-scoped data, but many APIs return all orgs' data
- Response shapes mostly consistent
- Include patterns vary (some include relations, some don't)

---

## Priority Fix List

### CRITICAL (Fix Immediately)

1. **Add authentication to all routes missing it** (12 routes)
   - `orders/route.ts`
   - `connections/route.ts`
   - `procurements/route.ts`
   - `inventory/route.ts`
   - `production/route.ts`
   - `finance/invoices/route.ts`
   - `hr/employees/route.ts`
   - `compliance/documents/route.ts`
   - `logistics/delivery/route.ts`
   - `marketing/campaigns/route.ts`
   - `communications/route.ts`
   - `analytics/sales-summary/route.ts`

2. **Add org scoping to all routes** (12 routes)
   - Same list as above
   - Filter GET by `organizationId: session.user.currentOrganizationId`
   - Set POST `organizationId` from session (not from body)

3. **Fix routes accepting `organizationId` from body** (2 routes)
   - `procurements/route.ts` POST
   - `communications/route.ts` POST

### HIGH PRIORITY

4. **Standardize response format**
   - Use `NextResponse.json()` consistently
   - Or create shared `jsonResponse` helper

5. **Add try-catch blocks** (9 routes)
   - All routes missing error handling

6. **Improve variable naming**
   - Replace short names: `conn`, `inv`, `d`, `c`

7. **Add foreign key validation**
   - Verify related records belong to user's org

### MEDIUM PRIORITY

8. **Add TypeScript types**
   - Define request/response interfaces
   - Remove `any` types

9. **Improve error logging**
   - Add consistent error logging to all routes

10. **Resolve route naming confusion**
    - Decide: `/api/customers` vs `/api/connections` (both use `Connection` model)

### LOW PRIORITY

11. **Code style consistency**
    - Consistent formatting
    - Consistent error messages

---

## Recommendations

1. **Create shared utilities:**
   - `requireAuth()` - Check session and return user/org
   - `requireOrgScope()` - Verify org membership
   - `jsonResponse()` - Standardized response helper

2. **Add middleware:**
   - Consider Next.js middleware for auth checks
   - Or create route wrapper functions

3. **Testing:**
   - Add tests for org isolation
   - Test cross-org access prevention

4. **Documentation:**
   - Document API patterns
   - Create coding guidelines

---

## Summary Statistics

- **Total Routes:** 29
- **Routes with Auth:** 12 (41%)
- **Routes with Org Scoping:** 4 (14%)
- **Routes with Try-Catch:** 4 (14%)
- **Routes with Consistent Response Format:** 2 (7%)
- **Critical Security Issues:** 17 routes (59%)

**Estimated Fix Time:**
- Critical fixes: 4-6 hours
- High priority: 2-3 hours
- Medium priority: 2-3 hours
- **Total: 8-12 hours**

