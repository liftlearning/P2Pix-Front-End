import type { Result } from "ethers/lib/utils"

export type DepositEvent = {
    blockNumber: number,
    blockHash: string,
    transactionIndex: number,
    transactionHash: string,
    event?: string,
    removed: boolean,
    address: string,
    args?: Result
}