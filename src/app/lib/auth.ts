import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { config } from "@/lib/constants";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId:     process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify guilds",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ account }) {
      if (account == null || account.access_token == null) return false;
      return await isJoinedGuild(account.access_token);
    },

    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
};

interface Guild {
  features: string[];
  icon: string;
  id: string;
  name: string;
  owner: boolean;
  permissions: number;
  permissions_new: string;
}

async function isJoinedGuild(accessToken: string): Promise<boolean> {
  const res: Response = await fetch(
    "https://discordapp.com/api/users/@me/guilds",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (res.ok) {
    // 所属するGuild(サーバー)一覧を取得
    const guilds: Guild[] = await res.json();

    // 特定のGuildに所属しているかどうかを確認
    const result = guilds.some(
      (guild: Guild) => guild.id === config.discord.allowedGuildId
    );

    // 所属していない場合はエラーを返す
    if (!result) {
      throw new Error("然るべきサーバーに所属していません");
    }

    return result;
  }

  return false;
}
