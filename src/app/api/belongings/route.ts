// app/api/accountHolderUsers/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/services/authServices";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  // 認証ユーザーの確認
  const authUser = await getAuthUser(req);

  if (!authUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // リクエストボディのパース
  const { accountHolderId } = await req.json();
  const userId = authUser.id;

  if (!accountHolderId || !userId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // 中間テーブルに関連付けを作成
    const association = await prisma.belonging.create({
      data: {
        accountHolderId,
        userId,
      },
    });

    return NextResponse.json(
      { message: "Association created", data: association },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating association:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const authUser = await getAuthUser(req);

  if (!authUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // URLからクエリパラメータを取得
  const { searchParams } = new URL(req.url);
  const accountHolderId = searchParams.get("accountHolderId");
  const userId = searchParams.get("userId");

  if (!accountHolderId || !userId) {
    return NextResponse.json(
      { message: "Missing required query parameters" },
      { status: 400 }
    );
  }

  try {
    // deleteManyを使用して該当するレコードを削除
    const deleted = await prisma.belonging.deleteMany({
      where: { accountHolderId, userId },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { message: "Association not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Association deleted" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting association:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
