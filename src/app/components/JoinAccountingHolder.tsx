'use client';

import { useState } from "react";

// 会計主体の型
interface AccountingHolder {
  id: string;
  name: string;
  type: "individual" | "corporate";
  startMonth: number;
  closingMonth: number;
}

// ダミー
const accountingHolders: AccountingHolder[] = [
  {
    id: "uuid1", // UUID
    name: "株式会社会計主体", // 会計主体名
    type: "individual", // 個人 or 法人
    startMonth: 2, // 開始月
    closingMonth: 1, // 決算月
  },
  {
    id: "uuid2", // UUID
    name: "株式会社会計主体", // 会計主体名
    type: "individual", // 個人 or 法人
    startMonth: 2, // 開始月
    closingMonth: 1, // 決算月
  },
];


export function JoinAccountingHolder() {
  const [holderId, setHolderId] = useState<string>("");

  const deleteAccountHolder = () => {
    if (!holderId) {
      alert("少なくとも1つの会計主体を選択してください。");
      return;
    }

    console.log("選択された会計主体:", holderId);
  };

  return (
    <>
      <h2 className="mt-10 text-center font-semibold">未加入の会計主体一覧</h2>

      <div
        className="flex flex-col items-center justify-center gap-4 py-4
        my-4 max-h-80 overflow-scroll border-[1px] border-gray-100 shadow-inner rounded-lg"
      >
        {accountingHolders.map((holder: AccountingHolder) => (
          <label key={holder.id} className="rounded-lg hover:bg-gray-100 p-2">
            <input
              type="radio"
              name="holder"
              className="nes-radio"
              value={holder.id}
              onChange={() => setHolderId(holder.id)}
            />
            <span>{holder.name}</span>
          </label>
        ))}
      </div>

      <div className="w-full flex justify-center">
        <button className="nes-btn is-success" onClick={deleteAccountHolder}>
          参加する
        </button>
      </div>
    </>
  );
}