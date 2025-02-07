export const config = {
  route_url: process.env.NEXT_PUBLIC_ROUTE_URL,
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    allowedGuildId: process.env.ALLOWED_GUILD_ID,
  },
};