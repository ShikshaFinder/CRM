# Flavi CRM - Multi-User Setup Guide

This guide explains how to set up the multi-user authentication system with Resend email integration.

## Prerequisites

- Node.js 18+ installed
- A Resend account (sign up at https://resend.com)
- A database (SQLite for local development, or Cloudflare D1 for production)

## Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
# Database
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Resend Email Configuration
RESEND_API_KEY="re_your_resend_api_key_here"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Base URL for email links
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Cloudflare D1 Configuration (if using Cloudflare)
CLOUDFLARE_D1_TOKEN=""
CLOUDFLARE_ACCOUNT_ID=""
CLOUDFLARE_DATABASE_ID=""
```

### Getting Your Resend API Key

1. Sign up at https://resend.com
2. Go to API Keys section
3. Create a new API key
4. Copy the key (starts with `re_`)
5. Add it to your `.env` file as `RESEND_API_KEY`

### Generating NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Features

### Multi-User Authentication

- ✅ User registration with email verification
- ✅ Password reset functionality
- ✅ Role-based access control (RBAC)
- ✅ Department management
- ✅ User profiles
- ✅ Session management with NextAuth
- ✅ Protected routes via middleware

### Email Functionality (Resend)

- ✅ Email verification on signup
- ✅ Password reset emails
- ✅ Professional HTML email templates

## User Roles

The system supports role-based access control. Users can have multiple roles assigned through the `UserRole` model. Common roles might include:

- Admin
- Manager
- Sales Representative
- Production Staff
- Inventory Manager
- etc.

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/verify-email?token=...` - Verify email address

### Session

- `GET /api/auth/session` - Get current session
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

## Session Data

The session includes:

```typescript
{
  user: {
    id: string
    email: string
    profile: {
      fullName?: string
      phone?: string
      // ... other profile fields
    }
    roles: string[]  // Array of role names
    department?: string
  }
}
```

## Protected Routes

All routes are protected by default except:
- `/signup`
- `/verify-email`
- `/reset-password`
- `/forgot-password`
- `/api/auth/*`

The middleware (`src/middleware.ts`) handles route protection automatically.

## Development

1. Start the development server:
```bash
npm run dev
```

2. Access the application at `http://localhost:3000`

3. Sign up a new user at `/signup`

4. Check your email for verification link

5. After verification, sign in at `/api/auth/signin`

## Production Deployment

1. Set all environment variables in your hosting platform
2. Ensure `NEXTAUTH_URL` matches your production domain
3. Use a strong `NEXTAUTH_SECRET`
4. Configure your Resend domain for sending emails
5. Run database migrations:
```bash
npm run prisma:migrate
```

## Troubleshooting

### Email not sending

- Check your `RESEND_API_KEY` is correct
- Verify `RESEND_FROM_EMAIL` is a verified domain in Resend
- Check Resend dashboard for email logs

### Authentication issues

- Ensure `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your domain
- Check database connection

### Session not persisting

- Clear browser cookies
- Check `NEXTAUTH_SECRET` is consistent across deployments
- Verify session strategy in `src/lib/auth.ts`

## Security Notes

- Always use HTTPS in production
- Never commit `.env` file to version control
- Use strong, unique `NEXTAUTH_SECRET`
- Regularly rotate API keys
- Implement rate limiting for auth endpoints
- Use bcrypt for password hashing (already implemented)

