import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/services/authServices";

export async function GET(req: NextRequest) {
  const authUser = await getAuthUser(req);

  // 認証されていない場合はエラーを返す
  if (!authUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // AccountTitle を全件取得
    const accountTitles = await prisma.accountTitle.findMany();

    return NextResponse.json({ data: accountTitles });
  } catch (error) {
    console.error("Error fetching account titles:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authUser = await getAuthUser(req);

  // 認証されていない場合はエラーを返す
  if (!authUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // リクエストボディから JSON をパース
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // AccountTitle を作成（Prisma のスキーマに従い name フィールドに値をセット）
    const accountTitle = await prisma.accountTitle.create({
      data: {
        name: title,
      },
    });

    return NextResponse.json(
      { data: accountTitle },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating account title:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
