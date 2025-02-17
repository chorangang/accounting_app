'use client';

import { useState, useEffect } from "react";
import type { BelongingWithAccountHolder } from "@/lib/types/holders";

export function JoinedAccountingHolder() {
  const [joinedHolderId, setJoinedHolderId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [holders, setHolders] = useState<BelongingWithAccountHolder>([]);

  useEffect(() => {
    fetch(`/api/holders?isJoined=true`)
      .then((res) => res.json())
      .then((data) => {
        setHolders(data.data);
        setIsLoading(false);
      })
      .catch((error) =>
        console.error("Error fetching AccountingHolders:", error)
      );
  }, []);

  const deleteAccountHolder = () => {
    if (!joinedHolderId) {
      alert("少なくとも1つの会計主体を選択してください。");
      return;
    }

    console.log("選択された会計主体:", joinedHolderId);

    debugger;

    fetch(`/api/belongings/${joinedHolderId}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        console.log(res);
        const body: { message: string } = await res.json();
        alert(body.message);

        // 強引にリロード
        location.reload();
      })
      .catch((error) => alert(error.message));
  }

  return (
    <>
      <h2 className="mt-10 text-center font-semibold">
        参加済みの会計主体一覧
      </h2>

      <div
        className="flex flex-col items-center justify-center gap-4 py-4 my-4
        max-h-80 overflow-scroll border-[1px] border-gray-100 shadow-inner rounded-lg"
      >
        {isLoading ? (
          <p className="nes-text is-disabled">Loading...</p>
        ) : (
          holders.map((holder: BelongingWithAccountHolder) => (
            <label key={holder.id} className="rounded-lg hover:bg-gray-100 p-2">
              <input
                type="radio"
                name="holder"
                className="nes-radio"
                value={holder.id}
                onChange={() => setJoinedHolderId(holder.id)}
              />
              <span>{holder.accountHolder.name}</span>
            </label>
          ))
        )}
      </div>

      <div className="w-full flex justify-center">
        <button className="nes-btn is-error" onClick={deleteAccountHolder}>
          退出する
        </button>
      </div>
    </>
  );
}
