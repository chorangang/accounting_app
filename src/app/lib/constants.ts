export const config = {
  route_url: process.env.NEXT_PUBLIC_ROUTE_URL,
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    allowedGuildId: process.env.ALLOWED_GUILD_ID,
  },
  s3: {
    region: process.env.R2_REGION,
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_API_KEY,
      secretAccessKey: process.env.R2_API_SECRET,
    },
    bucket: process.env.R2_BUCKET,
  },
};