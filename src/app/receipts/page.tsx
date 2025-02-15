"use client";

import { useState } from "react";
import Link from "next/link";

// 会計主体の型
interface AccountingHolder {
  id: string;
  name: string;
}

// 領収書の型
interface Receipt {
  id: string;
  holderId: string; // 会計主体のID
  filename: string;
  description: string;
  createdAt?: string;
}

export default function Receipts() {
  // 仮の会計主体データ（ログインユーザーが持っているもの）
  const userHolders: AccountingHolder[] = [
    { id: "holder1", name: "A社" },
    { id: "holder2", name: "B社" },
  ];

  // 仮の領収書データ
  const receipts: Receipt[] = [
    {
      id: "r1",
      holderId: "holder1",
      filename: "receipt1.jpg",
      description: "接待費",
      createdAt: "2021-10-01",
    },
    {
      id: "r2",
      holderId: "holder1",
      filename: "receipt2.pdf",
      description: "接待費",
      createdAt: "2021-10-01",
    },
    {
      id: "r3",
      holderId: "holder2",
      filename: "receipt3.png",
      description: "接待費",
      createdAt: "2021-10-01",
    },
  ];

  // 選択中の会計主体
  const [selectedHolder, setSelectedHolder] = useState(
    userHolders[0]?.id || ""
  );

  // // フォームの値を管理
  // const [description, setDescription] = useState({
  //   filename: "",
  //   description: "",
  // });

  // 領収書のアップロード処理（console.log で代用）
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`領収書アップロード: ${file.name} (会計主体: ${selectedHolder})`);
      alert("アップロード処理を実行しました（仮）");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="my-4 text-center font-semibold text-lg">領収書</h2>

      {/* 会計主体の選択 */}
      <div className="nes-select my-10">
        <select
          required
          id="holder_select"
          value={selectedHolder}
          onChange={(e) => setSelectedHolder(e.target.value)}
        >
          {userHolders.map((holder) => (
            <option key={holder.id} value={holder.id}>
              {holder.name}
            </option>
          ))}
        </select>
      </div>

      {/* 領収書のアップロード */}
      <div className="my-10">
        <label className="block text-sm font-medium">領収書を提出</label>
        <input
          type="file"
          accept="image/*, .pdf, .doc, .docx"
          onChange={handleUpload}
          className="nes-input w-full"
        />
      </div>

      {/* どんな領収書か */}
      <div className="my-10">
        <label className="block text-sm font-medium">領収書の説明</label>
        <textarea
          className="nes-textarea w-full"
          placeholder="例）接待費"
        ></textarea>
      </div>

      {/* 保存ボタン */}
      <div className="flex justify-center">
        <button className="nes-btn is-primary px-5">保 存</button>
      </div>

      {/* 領収書の一覧表示 */}
      <h2 className="mt-16 mb-4 text-center font-semibold text-lg">
        保存した領収書から仕訳を作る
      </h2>
      <ul className="grid gri-cols-1 gap-4">
        {receipts
          .filter((receipt) => receipt.holderId === selectedHolder)
          .map((receipt) => (
            <li key={receipt.id}>
              <Link
                href={`/journals?receiptId=${receipt.id}`}
                className="flex justify-between nes-text p-3 hover:bg-gray-100"
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
