import { defineStore } from "pinia";

export const useEtherStore = defineStore("ether", {
  state: () => ({
    walletAddress: "",
    balance: "",
    depositList: {},
  }),
  actions: {
    setWalletAddress(walletAddress: string) {
      this.walletAddress = walletAddress;
    },
    setBalance(balance: string) {
      this.balance = balance;
    },
    setDepositList(depositList: {}) {
      this.depositList = depositList;
    },
  },
});
