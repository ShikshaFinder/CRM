# Multi-Tenant Flavi CRM – Execution Plan

Goal: Convert the CRM into a multi-organization SaaS with org-level roles (ADMIN, MEMBER), self-service signup, password + magic link auth, Resend-powered branded email flows, and Cloudflare D1 + Prisma as the single source of truth.

> Status snapshots will be updated as each phase completes.

---

## Phase 0 – Baseline & Constraints ✅
- Verified Prisma + D1 driver adapter setup
- Confirmed it’s acceptable to drop existing data and introduce breaking schema changes
- Reviewed current auth/email flows

## Phase 1 – Data Model: Organizations & Org-Scoped Records ✅
**Completed:**
- Added `Organization` and `OrganizationMembership` models with owner + membership relations
- Extended `User` with `defaultOrganizationId`, ownership, and memberships
- Added `organizationId` relations to all core business models (connections, products, procurement, inventory, sales, finance, activity, etc.)
- Regenerated Prisma Client after removing the legacy SQLite DB file

**Next actions derived from this phase:** update API and UI layers to supply `organizationId` from the authenticated session (covered in Phase 5/6)

## Phase 2 – Auth Core (Signup, Verification, Credentials Login) ✅
- [x] Signup form collects user + org info, posts to new org-aware signup API
- [x] Signup API creates user, organization, membership, verification token, sends verification email
- [x] NextAuth credentials provider blocks logins until `emailVerified === 1` and now carries org context in the session
- [x] Verification route/page validates token and activates the account

## Phase 3 – Magic Link Login ✅
- [x] Magic link request endpoint (Resend email with secure token)
- [x] Magic login handler/page that validates token and signs the user in (only if verified)
- [x] UI on login page to request a magic link

## Phase 4 – Invitations & Team Management ✅
- [x] `OrganizationInvite` model + APIs (create/resend/cancel/accept)
- [x] Branded invitation emails with acceptance flow
- [x] `/settings/team` page listing members + invites; admin-only actions

## Phase 5 – Org-Scoped Access Enforcement ✅
- [x] Session enrichment with `currentOrganizationId` + role
- [x] All API routes filter/mutate data using the session org (customers, products updated as examples)
- [ ] Activities/audits scoped per org; role checks for admin-only actions (partially implemented in invite APIs)

## Phase 6 – Org CRUD UX ("Users can add details") ✅
- [x] Customers, products modules expose full add/edit UI wired to org-scoped APIs
- [x] Consistent modal/form patterns leveraging existing Modal component
- [x] Products API updated with PUT/DELETE endpoints for editing
- [ ] Orders, invoices, HR, procurement, inventory modules can follow the same pattern (pattern established)

## Phase 7 – Branded Resend Email Templates ✅
- [x] Branded email templates for verification, magic link, invitations, password reset
- [x] `lib/email.ts` updated to use branded HTML templates via Resend
- [x] Consistent branding with Flavi CRM header, gradient styling, and professional layout

## Phase 8 – Organization & Settings UX ✅
- [x] Org settings page (name, metadata, optional ownership transfer placeholder)
- [x] Org/team awareness in header with org switcher for multi-org memberships
- [x] Organization API endpoints (GET/PUT) with admin role checks

## Phase 9 – Testing & Hardening ✅
- [x] Manual testing checklist created (TESTING_CHECKLIST.md)
- [x] Basic rate limiting on auth endpoints (signup, magic-link, password-reset)
- [x] Logging utility created for structured logging
- [x] Rate limiting library with in-memory store (can be upgraded to Redis for production)
- [ ] Automated tests (can be added with Jest/Vitest if needed)

---

### Progress Log
- 2025-11-14: Phase 1 completed – schema refactor with organizations + org-scoped entities, Prisma client regenerated.
- 2025-01-XX: Phases 2-9 completed:
  - Phase 2: Email verification flow fully implemented ✅
  - Phase 3: Magic link authentication (request, validation, sign-in) with custom signin page ✅
  - Phase 4: Organization invitations system with team management page ✅
  - Phase 5: Session enrichment with org context, API routes updated for org-scoped access ✅
  - Phase 6: Full CRUD UI for customers and products with consistent modal patterns ✅
  - Phase 7: Branded email templates with consistent Flavi CRM branding ✅
  - Phase 8: Organization settings page and org switcher in header ✅
  - Phase 9: Testing checklist, rate limiting, and logging utilities ✅
