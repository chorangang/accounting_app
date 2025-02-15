"use client";

import { AddAccountingHolder } from '@/components/AddAccountingHolder';
import { JoinAccountingHolder } from '@/components/JoinAccountingHolder';
import { JoinedAccountingHolder } from '@/components/JoinedAccountingHolder';


export default function Profile() {
  return (
    <div className="max-w-lg mx-auto">
      {/* 会計主体の追加 */}
      <AddAccountingHolder />

      {/* 会計主体の登録 */}
      <JoinAccountingHolder />

      {/* 参加済みの会計主体 */}
      <JoinedAccountingHolder />
    </div>
  );
}
