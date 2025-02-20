import { postReceipt, uploadFile } from "@/_actions/receiptActions";

export default function ReceiptForm() {
  // サーバー側で実行されるアクションとして定義
  async function handleSubmit(formData: FormData) {
    "use server";

    // フォームデータから値を取得
    const file = formData.get("file") as File;
    const description = formData.get("description") as string;

    if (!file || !description) {
      alert("フォームを埋めてください。");
    }

    // S3 へのアップロード処理（サーバー側で環境変数が利用されるので安全）
    const fileName = await uploadFile(file);

    // データベースへの保存処理
    await postReceipt(description, fileName);
  }

  return (
    <form action={handleSubmit}>
      {/* 領収書のアップロード */}
      <div className="my-10">
        <label className="block text-sm font-medium">領収書を提出</label>
        <input
          type="file"
          name="file"
          accept="image/*, .pdf, .doc, .docx"
          className="nes-input w-full"
        />
      </div>

      {/* どんな領収書か */}
      <div className="my-10">
        <label className="block text-sm font-medium">領収書の説明</label>
        <input
          type="text"
          name="description"
          className="nes-input w-full"
          placeholder="例）接待費"
        />
      </div>

      {/* 保存ボタン */}
      <div className="flex justify-center">
        <button className="nes-btn is-primary px-5" type="submit">
          保 存
        </button>
      </div>
    </form>
  );
}
