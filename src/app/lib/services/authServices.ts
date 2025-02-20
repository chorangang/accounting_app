import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

interface AuthUser {
  id: string;
  name: string;
  email?: string;
}

// 認証ユーザーを取得
export async function getAuthUser(req: NextRequest): Promise<AuthUser|false> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // トークンが取得できない場合はfalse
  if (!token) {
    return false;
  }

  const userId = token?.sub;
  const name   = token?.name;
  const email  = token?.email;

  // 必要な情報が取得できない場合はfalse
  if (!userId || !name || !email) {
    return false;
  }

  return {
    id: userId,
    name: name,
    email: email,
  }
}
