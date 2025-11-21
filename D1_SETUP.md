# Cloudflare D1 Setup Guide

## Overview
Cloudflare D1 **does NOT use traditional database URLs**. The connection is handled via the Cloudflare API using the PrismaD1 adapter.

## Required Environment Variables

Add these to your `.env` file:

```env
# Placeholder for Prisma validation (D1 doesn't use URLs)
# Can be any SQLite URL format - adapter handles the real connection
DATABASE_URL="file:./dev.db"

# Cloudflare D1 API Credentials
CLOUDFLARE_D1_TOKEN="your_d1_api_token_here"
CLOUDFLARE_ACCOUNT_ID="your_account_id_here"
CLOUDFLARE_DATABASE_ID="e400ca26-1e7f-48c7-add0-4cedd12ce4fc"
```

## Getting Your Values

### 1. DATABASE_URL
- **Value**: `file:./dev.db` (or any SQLite URL format)
- **Purpose**: Placeholder for Prisma validation only
- **Note**: The PrismaD1 adapter handles the actual connection via API

### 2. CLOUDFLARE_DATABASE_ID
- **Value**: `e400ca26-1e7f-48c7-add0-4cedd12ce4fc` (from your wrangler.toml)
- **Status**: ✅ Already configured

### 3. CLOUDFLARE_ACCOUNT_ID
Get it by running:
```bash
npx wrangler login
npx wrangler whoami
```
Or find it in your Cloudflare dashboard URL: `https://dash.cloudflare.com/{account_id}/...`

### 4. CLOUDFLARE_D1_TOKEN
Create it at: https://dash.cloudflare.com/profile/api-tokens
- Click "Create Token"
- Use "Custom token" template
- Permissions needed: `Account` > `D1` > `Edit`
- Copy the token value

## How It Works

1. **Prisma Schema** uses `DATABASE_URL` for validation (placeholder)
2. **PrismaD1 Adapter** connects to D1 via Cloudflare API using:
   - `CLOUDFLARE_D1_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_DATABASE_ID`
3. **No direct database connection** - everything goes through Cloudflare API

## Verification

Once configured, verify your D1 database:
```bash
npx wrangler login
npx wrangler d1 list
npx wrangler d1 info crm-1
```

## Database Migrations

Push your schema to D1:
```bash
npx prisma db push
```

Or use migrations:
```bash
npx prisma migrate dev
npx wrangler d1 migrations apply crm-1
```

