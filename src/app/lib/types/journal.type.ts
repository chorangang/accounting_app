export interface Entry {
  id: number;
  date: string;
  account: string;
  debit: string;
  credit: string;
}

type EntryType = 'debit' | 'credit';

export interface EntryParams {
  accountTitleId: number;
  type: EntryType;
  amount: number;
}

export interface AccountTitle {
  id: number;
  name: string;
}

export interface JournalProps {
  id: string;
  date: string;
  description: string;
  credit: {
    amount: number;
    account: string;
  },
  debit: {
    amount: number;
    account: string;
  },
}