import { PutObjectCommand } from "@aws-sdk/client-s3";
import { generateS3Client } from "@/lib/services/s3Client";
import prisma from "@/lib/prisma";
import { config } from "@/lib/constants";
import { parseYYYYMMDD } from "@/lib/utils";
import type { Receipt, PrismaReceipt } from "@/lib/types/receipt.type";


export async function uploadFile(file: File): Promise<string> {
  const s3 = generateS3Client();

  // File オブジェクトを ArrayBuffer に変換し、Buffer に変換
  const data = await file.arrayBuffer();
  const buffer = Buffer.from(data);

  // 日付情報からファイルパスを生成（同一月内のファイルは同じフォルダにまとめる）
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth() + 1;
  const finePath = `receipts/${thisYear}_${thisMonth}/${file.name}`;

  // アップロード処理
  await s3.send(
    new PutObjectCommand({
      Bucket: config.s3.bucket!,
      Key: finePath,
      ContentType: file.type,
      Body: buffer,
    })
  );

  return finePath;
}

export async function postReceipt(description: string, filePath: string) {
  await prisma.receipt.create({
    data: {
      filePath: filePath,
      description: description,
    },
  });
}

export async function getReceipts(): Promise<Receipt[]> {
  const receipts: PrismaReceipt[] = await prisma.receipt.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      filePath: true,
      description: true,
      createdAt: true,
    },
  });

  // 日付方をそのまま返すと
  return receipts.map((receipt: PrismaReceipt) => ({
    id: receipt.id,
    filePath: receipt.filePath, // filePath を filename にリネーム
    description: receipt.description,
    createdAt: parseYYYYMMDD(new Date(receipt.createdAt || "unknown")),
  }));
}
