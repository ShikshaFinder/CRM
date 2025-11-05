process.loadEnvFile();

export const config = {
  cloudflare: {
    d1_token: process.env.CLOUDFLARE_D1_TOKEN!,
    account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
    db_id: process.env.CLOUDFLARE_DATABASE_ID!,
  },
};
