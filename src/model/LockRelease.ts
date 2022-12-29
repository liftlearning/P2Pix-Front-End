import type { Result } from "ethers/lib/utils"

export type ReleaseEvent = {
    blockNumber: number,
    blockHash: string,
    data: string,
    transactionHash: string,
    transactionIndex: number,
    removed: boolean,
    address: string,
    args?: Result | undefined
}