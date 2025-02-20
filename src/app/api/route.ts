import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/services/authServices";

export async function GET(req: NextRequest) {
  const authUser = await getAuthUser(req);

  // 認証ユーザーが取得できない場合は401エラーを返す
  if (!authUser) {
    return NextResponse.json({message: "Unauthorized"}, {status: 401});
  }

  return NextResponse.json({message: "Hello from the API"});
}
