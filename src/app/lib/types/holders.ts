export interface AccountingHolderParams {
  id?: string; // UUID APIで発行するのでオプショナルとする
  name: string;
  type: AccountHolderType;
  startMonth: number;
  closingMonth: number;
}

export type AccountHolderType = "individual" | "corporate";
