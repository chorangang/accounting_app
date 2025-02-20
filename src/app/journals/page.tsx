'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { AddAccountTitle } from "@/components/AddAccountTitle";
import { SelectAccountHolder } from "@/components/SelectAccountHolder";
import { SelectDate } from "@/components/SelectDate";
import { JournalForm } from "@/components/JournalForm";
import type { ReceiptWithPresingedUrl } from "@/lib/types/receipt.type";
import type { Entry, AccountTitle } from "@/lib/types/journal.type";


export default function Journals() {
  const searchParams = useSearchParams();
  const receiptId = searchParams.get("receiptId");

  const router = useRouter();

  // 会計主体のID
  const [accountHolderId, setAccountHolderId] = useState<string>("");

  // 日付
  const [date, setDate] = useState<string>("");

  // 仕訳のエントリを管理
  const [entries, setEntries] = useState<Entry[]>([
    { id: 1, date: "", account: "", debit: "", credit: "" },
    { id: 2, date: "", account: "", debit: "", credit: "" },
  ]);

  // 勘定科目リスト
  const [accountTitles, setAccountTitles] = useState<AccountTitle[]>([]);

  // メモ
  const [description, setDescription] = useState<string>("");

  // 貸借一致を常に確認
  const [isBalanced, setIsBalanced] = useState<boolean>(false);

  // 領収書の情報を取得
  const [receipt, setReceipt] = useState<ReceiptWithPresingedUrl>({
    id: "",
    description: "",
    presignedUrl: "",
  });

  useEffect(() => {
    if (!receiptId) {
      router.push("/receipts");
      return;
    }

    async function fetchReceipt() {
      try {
        const res = await fetch(`/api/receipts/${receiptId}`);
        const data = await res.json();
        setReceipt(data.data);
      } catch (error) {
        console.error("Error fetching receipt:", error);
      }
    }

    async function fetchAccountTitles() {
      try {
        const res = await fetch(`/api/account-titles`);
        const data = await res.json();
        setAccountTitles(data.data);
      } catch (error) {
        console.error("Error fetching account titles:", error);
      }
    }

    fetchReceipt();
    fetchAccountTitles();
  }, [router, receiptId, accountHolderId]);
  

  // 仕訳の保存処理（仮）
  const saveJournal = async () => {
    // 貸借一致じゃないときはアラートを出す 数字を入れないと反応しないはずなので、ここで数値型のチェックもしたことにする
    if (!isBalanced) {
      alert("借方と貸方の金額が一致していません。");
      return;
    }

    if (!receiptId) {
      alert("領収書が選択されていません。");
      return;
    }

    try {
      // 仕訳レコードに入れるデータをまとめる
      const journal = {
        date: date,
        description: description,
        receiptId: receiptId,
        // 会計主体のID accountIdよりはaccountHolderIdの方がわかりやすいが変えるのが面倒なのでschemaに準拠
        accountId: accountHolderId,
      };

      const arrangedEntries = entries.map((entry: Entry) => {
        // 借方か貸方か。貸方に値があれば借方、なければ貸方.
        const type = entry.debit === "" ? "credit" : "debit";

        // 金額を取得
        let amount = 0;
        if (type === "credit") {
          amount = Number(entry.credit || 0);
        } else {
          amount = Number(entry.debit || 0);
        }

        return {
          accountTitleId: Number(entry.account), // 勘定科目のID
          type: type,
          amount: amount,
        };
      });

      // POSTで渡すデータを作成
      const params = {
        journal: journal,
        entries: arrangedEntries,
      };

      // 保存処理をここに実装
      await fetch(`/api/journals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      location.reload();

    } catch (error) {
      console.error("Error saving journal:", error);
      alert("エラーが発生しました。");
    }
  };

  return (
    <>
      {/* 勘定科目を追加するための窓 */}
      <AddAccountTitle />

      <h2 className="text-center my-10 font-bold text-lg">仕訳作成</h2>

      {/* 仕訳を追加する会計主体を選択する */}
      <SelectAccountHolder setAccountHolderId={setAccountHolderId} />

      {/* 日付を選択する */}
      <SelectDate setDate={setDate} />

      {/* 仕訳入力フォーム */}
      <JournalForm
        entries={entries}
        setEntries={setEntries}
        accountTitles={accountTitles}
        setDescription={setDescription}
        isBalanced={isBalanced}
        setIsBalanced={setIsBalanced}
        saveJournal={saveJournal}
      />

      {/* 領収書ゾーン */}
      <div className="flex flex-col items-center gap-4">
        {receipt.id !== "" && (
          <>
            <h3>領収書情報</h3>
            <p>ID: {receipt.id}</p>
            <p>説明: {receipt.description}</p>
            <a href={receipt.presignedUrl} target="_blank">
              <Image
                src={receipt.presignedUrl}
                alt="Receipt"
                width={400}
                height={400}
              />
            </a>
          </>
        )}
      </div>
    </>
  );
}
