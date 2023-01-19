import type { BigNumber } from "ethers";

export type ValidDeposit = {
  depositID: BigNumber;
  blockNumber: number;
  remaining: string;
  seller: string;
  pixKey: string;
  pixTarget?: string;
};
