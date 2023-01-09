import type { Result } from "ethers/lib/utils"

export type DepositEvent = {
    blockNumber: number,
    blockHash: string,
    transactionIndex: number,
    removed: boolean,
    address: string,
    args?: Result | undefined
}