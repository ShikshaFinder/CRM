# Flavi CRM - Multi-Tenant Testing Checklist

## Authentication & Authorization

### Signup Flow
- [ ] User can sign up with email, password, and organization name
- [ ] Organization is created with unique slug
- [ ] User is set as organization owner with ADMIN role
- [ ] Verification email is sent
- [ ] User cannot login until email is verified
- [ ] Verification link expires after 24 hours
- [ ] User can resend verification email

### Magic Link Login
- [ ] User can request magic link from signin page
- [ ] Magic link email is sent (only for verified users)
- [ ] Magic link expires after 15 minutes
- [ ] User can sign in using magic link
- [ ] Used magic link tokens are deleted
- [ ] Expired magic link tokens are cleaned up

### Password Authentication
- [ ] User can sign in with email and password
- [ ] Unverified users cannot sign in
- [ ] Invalid credentials are rejected
- [ ] Session is created with org context

### Password Reset
- [ ] User can request password reset
- [ ] Reset email is sent
- [ ] Reset link expires after 1 hour
- [ ] User can reset password with valid token
- [ ] User cannot reset with expired token

## Organization & Team Management

### Invitations
- [ ] Admin can invite new members by email
- [ ] Invitation email is sent with branded template
- [ ] Invitation expires after 7 days
- [ ] User can accept invitation (must be signed in)
- [ ] User cannot accept invitation for different email
- [ ] Admin can cancel pending invitations
- [ ] Admin can resend invitations
- [ ] Duplicate invitations are prevented

### Team Management
- [ ] Admin can view all members
- [ ] Admin can view pending invitations
- [ ] Non-admin users cannot access team management
- [ ] Member list shows roles correctly
- [ ] Invitation list shows status correctly

### Organization Settings
- [ ] Admin can view organization details
- [ ] Admin can edit organization name
- [ ] Non-admin users cannot edit organization
- [ ] Owner sees ownership transfer placeholder

## Data Isolation (Org-Scoped Access)

### Customers
- [ ] User can only see customers from their organization
- [ ] User can create customers (automatically scoped to org)
- [ ] User can edit customers from their organization
- [ ] User cannot access customers from other organizations

### Products
- [ ] User can only see products from their organization
- [ ] User can create products (automatically scoped to org)
- [ ] User can edit products from their organization
- [ ] User can delete products from their organization
- [ ] User cannot access products from other organizations

### API Routes
- [ ] All GET endpoints filter by `currentOrganizationId`
- [ ] All POST endpoints set `organizationId` from session
- [ ] All PUT/DELETE endpoints verify org ownership
- [ ] Unauthorized requests return 401/403

## Session Management

### Session Enrichment
- [ ] Session includes `currentOrganizationId`
- [ ] Session includes `currentOrganizationRole`
- [ ] Session includes all memberships
- [ ] Default organization is set correctly

### Organization Switcher
- [ ] Header shows current organization name
- [ ] User can see all their memberships
- [ ] Current organization is highlighted
- [ ] Links to settings work correctly

## Email Templates

### Verification Email
- [ ] Email has branded header
- [ ] Email has clear call-to-action button
- [ ] Email includes expiry information
- [ ] Email is responsive

### Magic Link Email
- [ ] Email has branded header
- [ ] Email has clear sign-in button
- [ ] Email includes expiry information
- [ ] Email is responsive

### Invitation Email
- [ ] Email shows inviter name
- [ ] Email shows organization name
- [ ] Email has accept button
- [ ] Email includes expiry information

### Password Reset Email
- [ ] Email has branded header
- [ ] Email has reset button
- [ ] Email includes expiry information
- [ ] Email is responsive

## Security

### Rate Limiting
- [ ] Auth endpoints have rate limiting (to be implemented)
- [ ] Magic link requests are rate limited
- [ ] Password reset requests are rate limited

### Token Security
- [ ] Tokens are cryptographically secure (randomBytes)
- [ ] Tokens are single-use (deleted after use)
- [ ] Tokens have appropriate expiry times
- [ ] Expired tokens are cleaned up

### Access Control
- [ ] Admin-only actions check role
- [ ] Organization-scoped data is isolated
- [ ] Cross-organization access is prevented

## Edge Cases

### Multi-Organization Users
- [ ] User with multiple orgs sees all in switcher
- [ ] Default organization is used correctly
- [ ] Switching organizations (future feature) works

### Email Edge Cases
- [ ] Invalid email addresses are handled
- [ ] Email sending failures are logged
- [ ] Duplicate email sends are prevented where applicable

### Data Edge Cases
- [ ] Empty organization names are handled
- [ ] Very long organization names are handled
- [ ] Special characters in organization names are handled

## Performance

### Database Queries
- [ ] Queries use proper indexes
- [ ] N+1 queries are avoided
- [ ] Large result sets are paginated (where applicable)

### API Response Times
- [ ] API endpoints respond quickly
- [ ] Database queries are optimized
- [ ] Session lookups are efficient

## Browser Compatibility

### Modern Browsers
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

### Mobile
- [ ] Responsive design works on mobile
- [ ] Email templates render on mobile
- [ ] Forms are usable on mobile

