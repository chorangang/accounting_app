import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/services/authServices";
import type { JournalProps } from "@/lib/types/journal.type";

export async function GET(req: NextRequest) {
  const authUser = await getAuthUser(req);

  // 認証されていない場合はエラーを返す
  if (!authUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // URL からクエリパラメータを取得
  const { searchParams } = new URL(req.url);
  const accountHolderId = searchParams.get("accountHolderId");


  if (!accountHolderId) {
    return NextResponse.json(
      { error: "accountHolderId is required" },
      { status: 400 }
    );
  }

  try {
    // 会計主体に紐づく仕訳データを取得
    const journals = await prisma.journal.findMany({
      where: {
        accountId: accountHolderId,
      },
      include: {
        entries: {
          include: {
            accountTitle: true,
          },
        },
      },
    });

    // 取得した仕訳データを JournalProps 型の配列に変換
    const data: JournalProps[] = journals.map((journal) => {
      const debitEntry = journal.entries.find(
        (entry) => entry.type === "debit"
      );
      const creditEntry = journal.entries.find(
        (entry) => entry.type === "credit"
      );

      return {
        id: journal.id,
        date: journal.date.toISOString(),
        description: journal.description,
        debit: debitEntry
          ? {
              amount: debitEntry.amount,
              account: debitEntry.accountTitle.name,
            }
          : { amount: 0, account: "" },
        credit: creditEntry
          ? {
              amount: creditEntry.amount,
              account: creditEntry.accountTitle.name,
            }
          : { amount: 0, account: "" },
      };
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching journals", error);

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
    const { journal, entries } = await req.json();

    console.log("Journal data:", journal, entries, prisma.journal);

    // Journal レコードの作成
    const newJournal = await prisma.journal.create({
      data: {
        date:        new Date(journal.date), // 日付文字列を Date 型に変換
        description: journal.description,
        receiptId:   journal.receiptId,
        accountId:   journal.accountId,
        entries: {
          create: entries.map((entry: any) => ({
            type: entry.type,
            accountTitleId: Number(entry.accountTitleId),
            amount: entry.amount,
          })),
        },
      },
      // 作成後に関連する entries を含めた結果を返す
      include: {
        entries: true,
      },
    });

    return NextResponse.json({ data: newJournal }, { status: 201 });

  } catch (error) {
    console.error("Error saving journal", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
