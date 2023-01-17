import type { BigNumber } from "ethers";
import type { Result } from "ethers/lib/utils"

export type ValidDeposit = {
    depositID: BigNumber;
    blockNumber: number;
    remaining: string;
    seller: string;
    pixKey: (string | undefined);
    pixTarget?: string;
    args?: Result
    };
    