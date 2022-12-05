import { defineStore } from "pinia";

export const useEtherStore = defineStore("ether", {
  state: () => ({
    walletAddress: "",
    balance: "",
    // Depósitos válidos para compra
    depositsValidList: [{}],
    // Depósitos adicionados na blockchain
    depositsAddedList: [{}],
    // Depósitos expirados na blockchain
    depositsExpiredList: [{}],
    // Locks adicionados na blockchain
    locksAddedList: [{}],
  }),
  actions: {
    setWalletAddress(walletAddress: string) {
      this.walletAddress = walletAddress;
    },
    setBalance(balance: string) {
      this.balance = balance;
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
