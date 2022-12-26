<script setup lang="ts">
import { useEtherStore } from "@/store/ether";
import { storeToRefs } from "pinia";
import blockchain from "../utils/blockchain";
import ListingComponent from "@/components/ListingComponent.vue";
import type { BigNumber } from "ethers";
import { ref, onBeforeMount } from "vue";

const etherStore = useEtherStore();
const { walletAddress } = storeToRefs(etherStore);
const depositList = ref<any[]>([]);

const handleCancelDeposit = async (depositID: BigNumber) => {
  console.log(depositID);
  const response = await blockchain.cancelDeposit(depositID);
  if (response == true) console.log("Depósito cancelado com sucesso.");
};

onBeforeMount(async () => {
  if (walletAddress.value) {
    await blockchain
      .listDepositTransactionByWalletAddress(walletAddress.value)
      .then((value) => (depositList.value = value));
  }
});

etherStore.$subscribe(async (mutation, state) => {
  if (mutation.events.key == "walletAddress") {
    if (state.walletAddress) {
      await blockchain
        .listDepositTransactionByWalletAddress(state.walletAddress)
        .then((value) => (depositList.value = value));
    }
  }
});
</script>

<template>
  <div class="page">
    <div class="header">Gerenciar ofertas</div>
    <ListingComponent
      :wallet-transactions="depositList"
      :is-manage-mode="true"
      @cancel-deposit="handleCancelDeposit"
    ></ListingComponent>
  </div>
</template>

<style scoped>
.page {
  @apply flex flex-col gap-10 mt-20 w-full;
}

.header {
  @apply text-3xl text-gray-900 leading-9 font-bold justify-center flex;
}
</style>
