'use client';

import { useState, useEffect } from "react";

// 会計主体の型
interface AccountingHolder {
  id: string;
  name: string;
  type: "individual" | "corporate";
  startMonth: number;
  closingMonth: number;
}

export function JoinAccountingHolder() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [holderId, setHolderId] = useState<string>("");
  const [holders, setHolders] = useState<AccountingHolder[]>([]);

  useEffect(() => {
    fetch(`/api/holders?isJoined=false`)
      .then((res) => res.json())
      .then((data) => {
        setHolders(data.data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching AccountingHolders:", error));
  }, []);

  const belongAccountHolder = () => {
    if (!holderId) {
      alert("少なくとも1つの会計主体を選択してください。");
      return;
    }

    fetch("/api/belongings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountHolderId: holderId}),
    })
      .then(async (res) => {
        console.log(res);
        const body: { message: string; data: AccountingHolder } = await res.json();
        alert(body.message);

        // 強引にリロード
        location.reload();
      })
      .catch((error) => alert(error.message));
  };

  return (
    <>
      <h2 className="mt-10 text-center font-semibold">未加入の会計主体一覧</h2>

      <div
        className="flex flex-col items-center justify-center gap-4 py-4
        my-4 max-h-80 overflow-scroll border-[1px] border-gray-100 shadow-inner rounded-lg"
      >
        {isLoading ? (
          <p className="nes-text is-disabled">Loading...</p>
        ) : (
          holders.map((holder: AccountingHolder) => (
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
          ))
        )}
      </div>

      <div className="w-full flex justify-center">
        <button className="nes-btn is-success" onClick={belongAccountHolder}>
          参加する
        </button>
      </div>
    </>
  );
}