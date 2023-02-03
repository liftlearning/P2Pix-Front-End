import type { BigNumber } from "ethers";

export type ValidDeposit = {
  depositID: BigNumber;
  blockNumber: number;
  remaining: number;
  seller: string;
  pixKey: string;
  pixTarget?: string;
  open?: boolean;
};
