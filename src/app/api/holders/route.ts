import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/services/authServices";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  // 認証ユーザーを取得
  const authUser = await getAuthUser(req);

  // 認証ユーザーが取得できない場合は401エラーを返す
  if (!authUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 会計主体を取得する処理
  try {
    // URL のクエリパラメータから isJoined を取得
    const { searchParams } = new URL(req.url);
    const isJoined = searchParams.get("isJoined");
    let holders;

    if (isJoined === "true") {
      // ユーザーが参加している会計主体を取得
      holders = await prisma.belonging.findMany({
        where: { userId: authUser.id },
        include: {
          accountHolder: true,
        },
      });

    } else if (isJoined === "false") {
      // ユーザーが参加していない会計主体を取得
      holders = await prisma.accountHolder.findMany({
        where: {
          belongings: {
            none: { userId: authUser.id },
          },
        },
      });

    } else {
      // isJoined が指定されていない場合は全件取得（必要に応じて変更してください）
      holders = await prisma.accountHolder.findMany();
    }

    // 取得した会計主体をレスポンスとして返す
    return NextResponse.json({ data: holders });

  } catch (error) { // DB からの読み込みエラーが発生した場合
    console.error("Error fetching AccountHolders:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // 認証ユーザーを取得
  const authUser = await getAuthUser(req);

  // 認証ユーザーが取得できない場合は401エラーを返す
  if (!authUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // リクエストボディを JSON としてパース
  const body = await req.json();
  const { name, type, startMonth, closingMonth } = body;

  // 会計主体を作成する処理
  try {
    // 会計主体（AccountHolder）の作成
    const newHolder = await prisma.accountHolder.create({
      data: {
        name: name,
        type: type,
        startMonth:   startMonth,
        closingMonth: closingMonth,
      },
    });

    // 作成した会計主体をレスポンスとして返す
    return NextResponse.json(
      { message: "Accounting holder created successfully", data: newHolder },
      { status: 201 }
    );

  } catch (error) { // DB への書き込みエラーが発生した場合
    console.error("Error creating AccountHolder:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}