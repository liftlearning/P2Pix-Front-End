<script setup lang="ts">
import { useEtherStore } from "@/store/ether";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import ListingComponent from "@/components/ListingComponent.vue";
import { listAllTransactionByWalletAddress } from "@/blockchain/wallet";

const etherStore = useEtherStore();
const { walletAddress } = storeToRefs(etherStore);
const allUserTransactions = ref<any[]>([]);

if (walletAddress.value) {
  await listAllTransactionByWalletAddress(walletAddress.value)
    .then((res) => {
      if (res) allUserTransactions.value = res;
    });
}

watch(walletAddress, async (newValue) => {
  await listAllTransactionByWalletAddress(newValue).then((res) => {
    if (res) allUserTransactions.value = res;
  });
});

watch(walletAddress, async (newValue) => {
  console.log(newValue);
});

watch(allUserTransactions, (newValue) => {
  console.log(newValue);
});
</script>

<template>
  <div class="page">
    <div class="header">Histórico de transações</div>
    <div class="w-full max-w-4xl">
      <ListingComponent
        :wallet-transactions="allUserTransactions"
        :is-manage-mode="false"
      ></ListingComponent>
    </div>
  </div>
</template>

<style scoped>
.page {
  @apply flex flex-col gap-10 mt-20 w-full items-center;
}

.header {
  @apply text-3xl text-gray-900 leading-9 font-bold justify-center flex;
}
</style>
