import { Dispatch, SetStateAction, useEffect } from "react";
import type { Entry, AccountTitle } from "@/lib/types/journal.type";

interface entriesProps {
  entries: Entry[];
  setEntries: Dispatch<SetStateAction<Entry[]>>;
  accountTitles: AccountTitle[];
  setDescription: Dispatch<SetStateAction<string>>;
  isBalanced: boolean;
  setIsBalanced: (value: boolean) => void;
  saveJournal: () => void;
}

export function JournalForm({
  entries,
  setEntries,
  accountTitles,
  setDescription,
  isBalanced,
  setIsBalanced,
  saveJournal
}: entriesProps
) {
  // エントリ行を追加
  const addEntry = () => {
    const newId = entries.length ? entries[entries.length - 1].id + 1 : 1;
    setEntries([
      ...entries,
      { id: newId, date: "", account: "", debit: "", credit: "" },
    ]);
  };

  // エントリ行を削除
  const removeEntry = (id: number) =>
    setEntries(entries.filter((entry) => entry.id !== id));

  // エントリの値を更新
  const updateEntry = (
    id: number,
    field: "account" | "date" | "credit" | "debit",
    value: string
  ) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
    console.log(entries);
  };

  // 借方と貸方の合計を計算
  const calculateTotals = () => {
    const debitTotal = entries.reduce(
      (sum, entry) => sum + Number(entry.debit || 0),
      0
    );
    const creditTotal = entries.reduce(
      (sum, entry) => sum + Number(entry.credit || 0),
      0
    );

    return { debitTotal, creditTotal };
  };

  const { debitTotal, creditTotal } = calculateTotals();

  // entries の変更に合わせて isBalanced を更新する副作用
  useEffect(() => {
    if ((debitTotal === creditTotal) !== isBalanced) {
      setIsBalanced(debitTotal === creditTotal);
    }
  }, [debitTotal, creditTotal, isBalanced, setIsBalanced]);

  return (
    <>
      {/* 仕訳の入力フォーム 上部 */}
      <div className="flex flex-col gap-3">
        {entries.map((entry) => (
          <div key={entry.id} className="grid grid-cols-10 gap-3 mb-4">
            {/* 勘定科目の選択 */}
            <div className="nes-select col-span-3">
              <select
                required
                id="default_select"
                value={entry.account}
                onChange={(e) =>
                  updateEntry(entry.id, "account", e.target.value)
                }
              >
                <option value="">勘定科目を選択</option>
                {accountTitles.length === 0 ? (
                  <option value="">Loading...</option>
                ) : (
                  accountTitles?.map((title: AccountTitle) => (
                    <option key={title.id} value={title.id}>
                      {title.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* 金額の入力 借方 */}
            <div className="col-span-3">
              <input
                type="text"
                value={entry.debit}
                placeholder="借方金額"
                onChange={(e) => updateEntry(entry.id, "debit", e.target.value)}
                className="nes-input focus-visible:outline-none"
              />
            </div>

            {/* 金額の入力 貸方 */}
            <div className="col-span-3">
              <input
                type="number"
                placeholder="貸方金額"
                value={entry.credit}
                onChange={(e) =>
                  updateEntry(entry.id, "credit", e.target.value)
                }
                className="nes-input focus-visible:outline-none"
              />
            </div>

            {/* 行を削除するボタン */}
            {entries.length > 1 && (
              <button
                className="nes-btn is-error text-white col-span-1"
                onClick={() => removeEntry(entry.id)}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {/*　仕訳の入力フォーム 下部 */}
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

        {/* 各アクション用のボタンを表示 */}
        <div className="grid grid-cols-2 items-center gap-4">
          {/* この仕訳についての説明書きを残せる */}
          <textarea
            placeholder="メモを残しましょう"
            className="nes-textarea col-span-2"
            onChange={(e) => setDescription(e.target.value)}
          />
          {/* 行を追加するボタン */}
          <button className="nes-btn is-warning" onClick={addEntry}>
            ＋ 行を追加
          </button>

          {/* 保存ボタン */}
          <button
            className="nes-btn is-success"
            onClick={saveJournal}
            disabled={!isBalanced}
          >
            仕訳を保存
          </button>
        </div>

        {/* メッセージを表示 */}
        <div>
          {!isBalanced && (
            <p style={{ color: "red" }}>借方と貸方の金額が一致していません。</p>
          )}
        </div>
      </div>
    </>
  );
}
