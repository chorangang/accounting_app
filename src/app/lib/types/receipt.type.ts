// 領収書の型
export interface Receipt {
  id: string;
  filePath: string;
  description: string;
  createdAt: string;
}

export interface PrismaReceipt {
  id: string;
  filePath: string;
  description: string;
  createdAt: Date;
}


export interface ReceiptWithPresingedUrl {
  id: string;
  description: string;
  presignedUrl: string;
}