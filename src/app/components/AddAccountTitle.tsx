'use client';

import { useState } from "react";

// type Type = "asset" | "liability" | "equity" | "revenue" | "expense";

export function AddAccountTitle() {
  const [accountTitle, setAccountTitle] = useState<string>("");
  const [isLoaidng, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    // 送信処理
    await fetch("/api/account-titles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: accountTitle }),
    });

    // フォームをクリア
    setAccountTitle("");

    setIsLoading(false);
  }

  return (
    <div className="my-5 w-full sm:w-1/2 mx-auto">
      <h1>勘定科目を追加する</h1>
      <div className="flex gap-3 justify-between items-center">
        <input
          type="text"
          className="nes-input"
          value={accountTitle}
          placeholder="勘定科目名 ex)現金"
          onChange={(e) => setAccountTitle(e.target.value)}
        />
        {isLoaidng ? (
          <button className="nes-btn is-disabled" disabled>
            送信中...
          </button>
        ) : (
          <button className="nes-btn is-primary min-w-20" onClick={handleSubmit}>
            追 加
          </button>
        )}
      </div>
      {/* <label htmlFor="default_select">Default select</label>
      <div className="nes-select">
        <select required id="default_select">
          <option value="" disabled selected hidden>
            Select...
          </option>
          <option value="">資産</option>
          <option value="1">負債</option>
        </select>
      </div> */}
    </div>
  );
}