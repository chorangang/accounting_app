"use client";

import { useState, useEffect } from "react";
import type { JoinedAccountingHolderProps } from "@/lib/types/holders";

interface SelectAccountHolderProps {
  setAccountHolderId: (id: string) => void;
}

export function SelectAccountHolder({
  setAccountHolderId,
}: SelectAccountHolderProps) {
  const [joinedAccountHolders, setJoinedAccountHolders] = useState<JoinedAccountingHolderProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`/api/holders?isJoined=true`)
      .then((res) => res.json())
      .then((data) => {
        setJoinedAccountHolders(data.data);
        setIsLoading(false);
      })
      .catch((error) =>
        console.error("Error fetching AccountingHolders:", error)
      );
  }, []);

  return (
    <div className="nes-select w-1/2 mx-auto my-10 p-2">
      <select required id="default_select" onChange={(e) => setAccountHolderId(e.target.value)}>
        <option value="">--- 仕訳を記録する帳簿を選択 ---</option>
        {isLoading ? (
          <option>ロード中</option>
        ) : (
          joinedAccountHolders.map((holder: JoinedAccountingHolderProps) => (
            <option key={holder.id} value={holder.accountHolder.id}>
              {holder.accountHolder.name}
            </option>
          ))
        )}
      </select>
    </div>
  );
}
