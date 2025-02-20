export interface AccountingHolderParams {
  id?: string; // UUID APIで発行するのでオプショナルとする
  name: string;
  type: AccountHolderType;
  startMonth: number;
  closingMonth: number;
}

export type AccountHolderType = "individual" | "corporate";

export interface JoinedAccountingHolderProps {
  accountHolder: {
    id: string;
    name: string;
    type: "individual" | "corporate";
    startMonth: number;
    closingMonth: number;
    createdAt: string;
    updatedAt: string;
  };
  accountingHolderId: string;
  userId: string;
  id: string;
  createdAt: string;
}