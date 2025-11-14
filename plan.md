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

## Phase 2 – Auth Core (Signup, Verification, Credentials Login)
- [x] Signup form collects user + org info, posts to new org-aware signup API
- [x] Signup API creates user, organization, membership, verification token, sends verification email
- [x] NextAuth credentials provider blocks logins until `emailVerified === 1` and now carries org context in the session
- [ ] Verification route/page validates token and activates the account (existing endpoint works; will revisit if UX tweaks are needed)

## Phase 3 – Magic Link Login
- [ ] Magic link request endpoint (Resend email with secure token)
- [ ] Magic login handler/page that validates token and signs the user in (only if verified)
- [ ] UI on login page to request a magic link

## Phase 4 – Invitations & Team Management
- [ ] `OrganizationInvite` model + APIs (create/resend/cancel)
- [ ] Branded invitation emails with acceptance flow
- [ ] `/settings/team` page listing members + invites; admin-only actions

## Phase 5 – Org-Scoped Access Enforcement
- [ ] Session enrichment with `currentOrganizationId` + role
- [ ] All API routes filter/mutate data using the session org
- [ ] Activities/audits scoped per org; role checks for admin-only actions

## Phase 6 – Org CRUD UX (“Users can add details”)
- [ ] Customers, products, orders, invoices, HR, procurement, inventory modules expose add/edit UI wired to org-scoped APIs
- [ ] Consistent modal/form patterns leveraging existing UI components

## Phase 7 – Branded Resend Email Templates
- [ ] React email templates for verification, magic link, invitations, password reset
- [ ] `lib/email.ts` updated to send branded HTML via Resend

## Phase 8 – Organization & Settings UX
- [ ] Org settings page (name, metadata, optional ownership transfer)
- [ ] Org/team awareness in header + potential org switcher for future multi-org memberships

## Phase 9 – Testing & Hardening
- [ ] Automated tests (or manual checklist) for auth, invites, CRUD, org isolation
- [ ] Basic rate limiting / logging on auth endpoints

---

### Progress Log
- 2025-11-14: Phase 1 completed – schema refactor with organizations + org-scoped entities, Prisma client regenerated.
