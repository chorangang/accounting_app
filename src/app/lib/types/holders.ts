import { Prisma } from "@prisma/client";

export type BelongingWithAccountHolder = Prisma.BelongingGetPayload<{
  include: { accountHolder: true };
}>;

export interface AccountingHolderParams {
  id?: string; // UUID APIで発行するのでオプショナルとする
  name: string;
  type: AccountHolderType;
  startMonth: number;
  closingMonth: number;
}

export type AccountHolderType = "individual" | "corporate";
