import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/services/authServices";
import prisma from "@/lib/prisma";


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ belongingId: string}> }
) {
  const authUser = await getAuthUser(req);

  if (!authUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // URLのパスパラメータからIDを取得
  const belongingId = (await params).belongingId;

  if (!belongingId) {
    return NextResponse.json(
      { message: "Missing required query parameters" },
      { status: 400 }
    );
  }

  try {
    // deleteManyを使用して該当するレコードを削除
    const deleted = await prisma.belonging.deleteMany({
      where: {
        id: belongingId,
      },
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
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}