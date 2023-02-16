export type WalletTransaction = {
  token: string;
  blockNumber: number;
  amount: number;
  seller: string;
  buyer: string;
  event: string;
  lockStatus: number;
  transactionHash: string;
};
