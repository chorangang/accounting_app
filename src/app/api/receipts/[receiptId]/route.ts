import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { config } from "@/lib/constants";
import { getAuthUser } from "@/lib/services/authServices";
import { generateS3Client } from "@/lib/services/s3Client";
import { ReceiptWithPresingedUrl } from "@/lib/types/receipt.type";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ receiptId: string }> }
) {
  const authUser = await getAuthUser(req);

  // 認証されていない場合はエラーを返す
  if (!authUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 領収書IDを取得
  const receiptId = (await params).receiptId;

  // 領収書IDがない場合はエラーを返す
  if (!receiptId) {
    return NextResponse.json(
      { message: "Missing required query parameters" },
      { status: 400 }
    );
  }

  // 領収書を取得
  const receipt = await prisma.receipt.findUnique({
    where: {
      id: receiptId,
    },
    select: {
      id: true,
      description: true,
      filePath: true,
    },
  });

  if (!receipt) {
    return NextResponse.json({ message: "Receipt not found" }, { status: 404 });
  }

  // S3クライアントを生成し、署名付き URL を取得する
  const s3 = generateS3Client();
  const command = new GetObjectCommand({
    Bucket: config.s3.bucket,
    Key: receipt.filePath,
  });
  // 例として、有効期限を 1 時間 (3600 秒) に設定
  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

  const data: ReceiptWithPresingedUrl = {
    id: receipt.id,
    description: receipt.description,
    presignedUrl: presignedUrl,
  };

  return NextResponse.json({data: data});
}