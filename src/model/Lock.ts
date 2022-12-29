import type { Result } from "ethers/lib/utils"

export type LockEvent = {
    blockNumber: number,
    blockHash: string,
    event?: string,
    transactionHash: string,
    transactionIndex: number,
    removed: boolean,
    address: string,
    args?: Result | undefined
}