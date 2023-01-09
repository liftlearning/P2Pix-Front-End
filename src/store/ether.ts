import { defineStore } from "pinia";
import type { DepositEvent } from "@/model/Deposit";
import type { LockEvent } from "@/model/Lock";
import type { ReleaseEvent } from "@/model/LockRelease";
import type {ValidDeposit} from "@/model/ValidDeposit";

export const useEtherStore = defineStore("ether", {
  state: () => ({
    walletAddress: "",
    balance: "",
    loadingLock: false,
    // Depósitos válidos para compra
    depositsValidList: [] as ValidDeposit[],
    // Depósitos adicionados na blockchain
    depositsAddedList: [] as ValidDeposit[],
    // Depósitos expirados na blockchain
    depositsExpiredList: [] as ValidDeposit[],
    // Locks adicionados na blockchain
    locksAddedList: [] as LockEvent[],
    // Locks 'released' na blockchain
    locksReleasedList: [] as ReleaseEvent[],
    // Locks expirados na blockchain
    locksExpiredList: [] as LockEvent[],
  }),
  actions: {
    setWalletAddress(walletAddress: string) {
      this.walletAddress = walletAddress;
    },
    setBalance(balance: string) {
      this.balance = balance;
    },
    setLoadingLock(isLoadingLock: boolean) {
      this.loadingLock = isLoadingLock;
    },
    setDepositsValidList(depositsValidList: ValidDeposit[]) {
      this.depositsValidList = depositsValidList;
    },
    setDepositsAddedList(depositsAddedList: ValidDeposit[]) {
      this.depositsAddedList = depositsAddedList;
    },
    setDepositsExpiredList(depositsExpiredList: ValidDeposit[]) {
      this.depositsExpiredList = depositsExpiredList;
    },
    setLocksAddedList(locksAddedList: LockEvent[]) {
      this.locksAddedList = locksAddedList;
    },
    setLocksReleasedList(locksReleasedList: ReleaseEvent[]) {
      this.locksReleasedList = locksReleasedList;
    },
    setLocksExpiredList(locksExpiredList: LockEvent[]) {
      this.locksExpiredList = locksExpiredList;
    },
  },
  getters: {
    getValidDepositByWalletAddress: (state) => {
      return (walletAddress: string) =>
        state.depositsValidList
          .filter((deposit) => deposit.seller == walletAddress)
          .sort((a, b) => {
            return b.blockNumber - a.blockNumber;
          });
    },
  },
});
