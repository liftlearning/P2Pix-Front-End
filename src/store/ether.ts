import { NetworkEnum } from "@/model/NetworkEnum";
import type { ValidDeposit } from "@/model/ValidDeposit";
import { defineStore } from "pinia";

export const useEtherStore = defineStore("ether", {
  state: () => ({
    walletAddress: "",
    balance: "",
    networkName: NetworkEnum.ethereum,
    loadingLock: false,
    sellerView: false,
    // Depósitos válidos para compra GOERLI
    depositsValidListGoerli: [] as ValidDeposit[],
    // Depósitos válidos para compra MUMBAI
    depositsValidListMumbai: [] as ValidDeposit[],
    loadingWalletTransactions: false,
    loadingNetworkLiquidity: false,
  }),
  actions: {
    setWalletAddress(walletAddress: string) {
      this.walletAddress = walletAddress;
    },
    setBalance(balance: string) {
      this.balance = balance;
    },
    setNetworkName(networkName: NetworkEnum) {
      this.networkName = networkName;
    },
    setLoadingLock(isLoadingLock: boolean) {
      this.loadingLock = isLoadingLock;
    },
    setSellerView(sellerView: boolean) {
      this.sellerView = sellerView;
    },
    setDepositsValidListGoerli(depositsValidList: ValidDeposit[]) {
      this.depositsValidListGoerli = depositsValidList;
    },
    setDepositsValidListMumbai(depositsValidList: ValidDeposit[]) {
      this.depositsValidListMumbai = depositsValidList;
    },
    setLoadingWalletTransactions(isLoadingWalletTransactions: boolean) {
      this.loadingWalletTransactions = isLoadingWalletTransactions;
    },
    setLoadingNetworkLiquidity(isLoadingNetworkLiquidity: boolean) {
      this.loadingNetworkLiquidity = isLoadingNetworkLiquidity;
    },
  },
  // Alterar para integrar com mumbai
  getters: {
    getValidDepositByWalletAddress: (state) => {
      return (walletAddress: string) =>
        state.depositsValidListGoerli
          .filter((deposit) => deposit.seller == walletAddress)
          .sort((a, b) => {
            return b.blockNumber - a.blockNumber;
          });
    },
  },
});
