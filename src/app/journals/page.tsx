'use client';

import { useState } from "react";

// 仮の勘定科目リスト
const accountTitles = [
  "現金",
  "売掛金",
  "仕入",
  "売上",
  "備品",
  "クソ長い勘定科目を想定して追加した勘定科目"
  // 必要に応じて他の勘定科目を追加
];

interface Entry {
  id:      number;
  account: string;
  debit:   string;
  credit:  string;
}

export default function Journals() {
  const [entries, setEntries] = useState<Entry[]>([
    { id: 1, account: "", debit: "", credit: "" },
    { id: 2, account: "", debit: "", credit: "" },
  ]);

  // エントリ行を追加
  const addEntry = () => {
    const newId = entries.length ? entries[entries.length - 1].id + 1 : 1;
    setEntries([...entries, { id: newId, account: "", debit: "", credit: "" }]);
  };

  // エントリ行を削除
  const removeEntry = (id: number) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  // エントリの値を更新
  const updateEntry = (id: number, field: "account" | "credit" | "debit", value: string) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  // 借方と貸方の合計を計算
  const calculateTotals = () => {
    const debitTotal  = entries.reduce((sum, entry) => sum + Number(entry.debit  || 0), 0);
    const creditTotal = entries.reduce((sum, entry) => sum + Number(entry.credit || 0), 0);
    return { debitTotal, creditTotal };
  };

  const { debitTotal, creditTotal } = calculateTotals();
  const isBalanced = debitTotal === creditTotal;

  // 仕訳の保存処理（仮）
  const saveJournal = () => {
    // 貸借一致じゃないときはアラートを出す
    if (!isBalanced) {
      alert("借方と貸方の金額が一致していません。");
      return;
    }
    // 保存処理をここに実装
    console.log("仕訳が保存されました:", entries);
  };

  return (
    <>
      <h2 className="text-center my-10 font-bold text-lg">仕訳作成</h2>
      <div className="flex flex-col gap-3">
        {entries.map((entry) => (
          <div key={entry.id} className="flex justify-between gap-3">
            <div className="nes-select">
              <select
                required
                id="default_select"
                value={entry.account}
                onChange={(e) =>
                  updateEntry(entry.id, "account", e.target.value)
                }
              >
                <option value="">勘定科目を選択</option>
                {accountTitles.map((title, idx) => (
                  <option key={idx} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={entry.debit}
              placeholder="借方金額"
              onChange={(e) => updateEntry(entry.id, "debit", e.target.value)}
              className="nes-input focus-visible:outline-none"
            />
            <input
              type="number"
              placeholder="貸方金額"
              value={entry.credit}
              onChange={(e) => updateEntry(entry.id, "credit", e.target.value)}
              className="nes-input focus-visible:outline-none"
            />
            {entries.length > 1 && (
              <button
                className="nes-btn is-error text-white"
                onClick={() => removeEntry(entry.id)}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-4 my-5">
        {/* 仕訳の合計値を表示 */}
        <div className="flex justify-end items-center gap-4 w-full">
          <span className="text-lg">
            借方合計: <strong className="text-blue-500">{debitTotal}</strong>
          </span>
          <span className="text-lg">
            貸方合計: <strong className="text-red-500">{creditTotal}</strong>
          </span>
        </div>
        {/* メッセージを表示 */}
        <div>
          {!isBalanced && (
            <p style={{ color: "red" }}>借方と貸方の金額が一致していません。</p>
          )}
        </div>
        {/* 各アクション用のボタンを表示 */}
        <div className="flex gap-4">
          <button className="nes-btn is-warning" onClick={addEntry}>
            ＋ 行を追加
          </button>
          <label htmlFor="file" className="nes-btn">
            領収書を提出
            <input id="file" type="file" className="w-0" />
          </label>
        </div>
        {/* 保存ボタン */}
        <button
          className="nes-btn is-success"
          onClick={saveJournal}
          disabled={!isBalanced}
        >
          仕訳を保存
        </button>
      </div>
    </>
  );
}
