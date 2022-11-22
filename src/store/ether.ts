import { defineStore } from "pinia";

export const useEtherStore = defineStore("ether", {
  state: () => ({
    walletAddress: "",
    balance: "",
  }),
  actions: {
    setWalletAddress(walletAddress: string) {
      this.walletAddress = walletAddress;
    },
    setBalance(balance: string) {
      this.balance = balance;
    },
  },
});
