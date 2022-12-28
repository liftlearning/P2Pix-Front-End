<script setup lang="ts">
import { useEtherStore } from "@/store/ether";
import { storeToRefs } from "pinia";
import blockchain from "../utils/blockchain";
import ListingComponent from "@/components/ListingComponent.vue";
import type { BigNumber } from "ethers";
import { ref } from "vue";

const etherStore = useEtherStore();
const { walletAddress } = storeToRefs(etherStore);
const depositList = ref<any[]>([]);

const handleCancelDeposit = async (depositID: BigNumber) => {
  const response = await blockchain.cancelDeposit(depositID);
  if (response == true) {
    console.log("Depósito cancelado com sucesso.");
    await blockchain
      .listValidDepositTransactionsByWalletAddress(walletAddress.value)
      .then((deposits) => {
        if (deposits) depositList.value = deposits;
      });
  }
};

const handleWithDrawDeposit = async (depositID: BigNumber) => {
  const response = await blockchain.withdrawDeposit(depositID);
  if (response == true) {
    console.log("Token retirado com sucesso.");
    await blockchain
      .listValidDepositTransactionsByWalletAddress(walletAddress.value)
      .then((deposits) => {
        if (deposits) depositList.value = deposits;
      });
  }
};

if (walletAddress.value) {
  depositList.value = etherStore.getValidDepositByWalletAddress(
    walletAddress.value
  );
}

etherStore.$subscribe(async (_mutation, state) => {
  if (state.walletAddress != "" && state.depositsValidList.length > 0) {
    await blockchain
      .listValidDepositTransactionsByWalletAddress(walletAddress.value)
      .then((deposits) => {
        if (deposits) depositList.value = deposits;
      });
  }
});
</script>

<template>
  <div class="page">
    <div class="header">Gerenciar ofertas</div>
    <div class="w-full max-w-4xl">
      <ListingComponent
        :wallet-transactions="depositList"
        :is-manage-mode="true"
        @cancel-deposit="handleCancelDeposit"
        @withdraw-deposit="handleWithDrawDeposit"
      ></ListingComponent>
    </div>
  </div>
</template>

<style scoped>
.page {
  @apply flex flex-col items-center gap-10 mt-20 w-full;
}

.header {
  @apply text-3xl text-gray-900 leading-9 font-bold justify-center flex;
}
</style>
