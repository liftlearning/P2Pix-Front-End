import type { BigNumber } from "ethers";

export type ValidDeposit = {
    depositID?: string;
    blockNumber: number;
    remaining: any;
    seller: string;
    pixKey: (string | undefined);
    pixTarget?: string;
    };
    