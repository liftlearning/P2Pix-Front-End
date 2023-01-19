import { NetworkEnum } from "@/model/NetworkEnum";
import type { ValidDeposit } from "@/model/ValidDeposit";
import type { Event } from "ethers";
import { defineStore } from "pinia";

export const useEtherStore = defineStore("ether", {
  state: () => ({
    walletAddress: "",
    balance: "",
    networkName: NetworkEnum.ethereum,
    loadingLock: false,
    loadingWalletTransactionHistory: false,
    loadingWalletBids: false,
    sellerView: false,
    // Depósitos válidos para compra GOERLI
    depositsValidListGoerli: [] as ValidDeposit[],
    // Depósitos válidos para compra MUMBAI
    depositsValidListMumbai: [] as ValidDeposit[],
    // Depósitos adicionados na blockchain
    depositsAddedList: [] as Event[],
    // Depósitos expirados na blockchain
    depositsExpiredList: [] as Event[],
    // Locks adicionados na blockchain
    locksAddedList: [] as Event[],
    // Locks 'released' na blockchain
    locksReleasedList: [] as Event[],
    // Locks expirados na blockchain
    locksExpiredList: [] as Event[],
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
    setLoadingWalletTransactionHistory(loadingWalletTransactionHistory: boolean) {
      this.loadingWalletTransactionHistory = loadingWalletTransactionHistory;
    },
    setLoadingWalletBids(loadingWalletBids: boolean) {
      this.loadingWalletBids = loadingWalletBids;
    },
    setDepositsValidListGoerli(depositsValidList: ValidDeposit[]) {
      this.depositsValidListGoerli = depositsValidList;
    },
    setDepositsValidListMumbai(depositsValidList: ValidDeposit[]) {
      this.depositsValidListMumbai = depositsValidList;
    },
    setDepositsAddedList(depositsAddedList: Event[]) {
      this.depositsAddedList = depositsAddedList;
    },
    setDepositsExpiredList(depositsExpiredList: Event[]) {
      this.depositsExpiredList = depositsExpiredList;
    },
    setLocksAddedList(locksAddedList: Event[]) {
      this.locksAddedList = locksAddedList;
    },
    setLocksReleasedList(locksReleasedList: Event[]) {
      this.locksReleasedList = locksReleasedList;
    },
    setLocksExpiredList(locksExpiredList: Event[]) {
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
