"use client";

import { useState, useEffect } from "react";
import { SelectAccountHolder } from "@/components/SelectAccountHolder";
import type { JournalProps } from "@/lib/types/journal.type";

export default function FinancialResults() {
  // 会計主体のID
  const [accountHolderId, setAccountHolderId] = useState<string>("");
  // 仕訳一覧
  const [journals, setJournals] = useState<JournalProps[]>([]);

  useEffect(() => {
    async function fetchJournals() {
      if (!accountHolderId) {
        return;
      }

      const res  = await fetch("/api/journals?accountHolderId=" + accountHolderId);
      const data = await res.json();

      setJournals(data.data);
    }

    fetchJournals();
  }, [accountHolderId]);

  return (
    <>
      {/* 会計主体を選択 */}
      <SelectAccountHolder setAccountHolderId={setAccountHolderId} />

      {/* 仕訳一覧 */}
      <div className="nes-table-responsive">
        {journals.length === 0 ? (
          <p className="text-center">仕訳データはありません。</p>
        ) : (
          journals.map((journal: JournalProps) => (
            <div key={journal.id} className="grid grid-cols-10 gap-3 mb-4 border-b-2 py-2">
              <span className="col-span-3">
                {new Date(journal.date).toLocaleDateString()}
              </span>
              <span className="col-span-3">
                {journal.debit
                  ? `${journal.debit.account} ${journal.debit.amount}`
                  : "-"}
              </span>
              <span>
                /
              </span>
              <span className="col-span-3">
                {journal.credit
                  ? `${journal.credit.account} ${journal.credit.amount}`
                  : "-"}
              </span>
              <span className="col-span-1">メモ: </span>
              <span className="col-span-9">{journal.description}</span>
            </div>
          ))
        )}
      </div>
    </>
  );
}
