"use client";

import { useState } from "react";
import { AccountingHolderParams } from "@/lib/types/holders";

export function AddAccountingHolder () {
  const [form, setForm] = useState<Omit<AccountingHolderParams, "id">>({
    name: "",
    type: "individual",
    startMonth: 4,
    closingMonth: 3,
  });

  // 開始月と決算月の差が12ヶ月かチェックし真偽値を返す
  const fiscalMonthChecker = (startMonth: number, closingMonth: number) => {
    // 正
    if ((closingMonth - startMonth + 12) % 12 === 11) {
      return true;
    }

    // 誤
    alert("会計年度の期間は12ヶ月である必要があります。");
    return false;
  };

  // 入力フィールドの変更処理
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        // 開始月と決算月は数値に変換
        name === "startMonth" || name === "closingMonth"
          ? Number(value)
          : value,
    }));
  };

  // 追加処理
  const addHolder = () => {
    // 名前が空ならエラー
    if (!form.name.trim()) {
      alert("名前を入力してください。");
      return;
    }

    // 開始月と決算月の差が12ヶ月かチェックし、適切でないならエラー
    if (!fiscalMonthChecker(form.startMonth, form.closingMonth)) return;

    // api/holders に POST リクエストを送信し、会計主体を作成
    fetch("/api/holders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    // フォームの初期化
    setForm({
      name: "",
      type: "individual",
      startMonth: 1,
      closingMonth: 12,
    });

    // リロードして強引に再描画
    location.reload();
  };

  return (
    <>
      <h2 className="my-4 text-center font-semibold">
        個人、または法人を追加する
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium">名前</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="nes-input w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">種別</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="nes-input w-full"
        >
          <option value="individual">個人</option>
          <option value="corporate">法人</option>
        </select>
      </div>

      <div className="flex gap-4">
        <div className="mb-4 w-1/2">
          <label className="block text-sm font-medium">開始月</label>
          <input
            type="number"
            name="startMonth"
            value={form.startMonth}
            onChange={handleChange}
            min="1"
            max="12"
            className="nes-input w-full"
          />
        </div>

        <div className="mb-4 w-1/2">
          <label className="block text-sm font-medium">決算月</label>
          <input
            type="number"
            name="closingMonth"
            value={form.closingMonth}
            onChange={handleChange}
            min="1"
            max="12"
            className="nes-input w-full"
          />
        </div>
      </div>

      <div className="flex justify-center my-4">
        <button onClick={addHolder} className="nes-btn is-primary font-semibold">
          追加する
        </button>
      </div>
    </>
  );
}
