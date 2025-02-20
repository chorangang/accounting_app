import Link from "next/link";
import ReceiptForm from "@/components/ReceiptForm";
import { getReceipts } from "@/_actions/receiptActions";
import type { Receipt } from "@/lib/types/receipt.type";


export default async function Receipts() {
  const receipts: Receipt[] = await getReceipts();

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="my-4 text-center font-semibold text-lg">領収書</h2>

      {/* 領収書のアップロードフォーム */}
      <ReceiptForm />

      {/* 領収書の一覧表示 */}
      <h2 className="mt-16 mb-4 text-center font-semibold text-lg">
        保存した領収書から仕訳を作る
      </h2>
      <ul className="grid gri-cols-1 gap-4">
        {receipts.map((receipt) => (
          <li key={receipt.id}>
            <Link
              href={`/journals?receiptId=${receipt.id}`}
              className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-md hover:bg-gray-200"
            >
              <span>{receipt.description}</span>
              <span>{receipt.createdAt}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
