import type { ethers } from "ethers";
import { defineStore } from "pinia";

export const useEtherStore = defineStore("ether", {
  state: () => ({
    walletAddress: "",
    balance: 0,
    provider: null as ethers.providers.Web3Provider | null,
  }),
  actions: {
    setWalletAddress(walletAddress: string) {
      this.walletAddress = walletAddress;
    },
    setBalance(balance: number) {
      this.balance = balance;
    },
    setProvider(provider: ethers.providers.Web3Provider | null) {
      this.provider = provider;
    },
  },
});
