import { NetworkEnum } from "@/model/NetworkEnum";
import { defineStore } from "pinia";

export const useEtherStore = defineStore("ether", {
  state: () => ({
    walletAddress: "",
    balance: "",
    networkName: NetworkEnum.ethereum,
    loadingLock: false,
    sellerView: false,
    // Depósitos válidos para compra GOERLI
    depositsValidListGoerli: [] as any[],
    // Depósitos válidos para compra MUMBAI
    depositsValidListMumbai: [] as any[],
    // Depósitos adicionados na blockchain
    depositsAddedList: [] as any[],
    // Depósitos expirados na blockchain
    depositsExpiredList: [] as any[],
    // Locks adicionados na blockchain
    locksAddedList: [] as any[],
    // Locks 'released' na blockchain
    locksReleasedList: [] as any[],
    // Locks expirados na blockchain
    locksExpiredList: [] as any[],
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
    setDepositsValidListGoerli(depositsValidList: any[]) {
      this.depositsValidListGoerli = depositsValidList;
    },
    setDepositsValidListMumbai(depositsValidList: any[]) {
      this.depositsValidListMumbai = depositsValidList;
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
    setLocksReleasedList(locksReleasedList: any[]) {
      this.locksReleasedList = locksReleasedList;
    },
    setLocksExpiredList(locksExpiredList: any[]) {
      this.locksExpiredList = locksExpiredList;
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
