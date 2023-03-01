export type ValidDeposit = {
  token: string;
  blockNumber: number;
  remaining: number;
  seller: string;
  pixKey: number;
  open?: boolean;
};
