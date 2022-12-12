import { defineStore } from "pinia";

export const useEtherStore = defineStore("ether", {
  state: () => ({
    walletAddress: "",
    balance: "",
    loadingLock: false,
    // Depósitos válidos para compra
    depositsValidList: [] as any[],
    // Depósitos adicionados na blockchain
    depositsAddedList: [] as any[],
    // Depósitos expirados na blockchain
    depositsExpiredList: [] as any[],
    // Locks adicionados na blockchain
    locksAddedList: [] as any[],
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
    setDepositsValidList(depositsValidList: any[]) {
      this.depositsValidList = depositsValidList;
    },
    setDepositsAddedList(depositsAddedList: any[]) {
      this.depositsAddedList = depositsAddedList;
    },
    setDepositsExpiredList(depositsExpiredList: any[]) {
      this.depositsExpiredList = depositsExpiredList;
    },
    setLocksAddedList(locksAddedList: any[]) {
      this.locksAddedList = locksAddedList;
    },
  },
});
