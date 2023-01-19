<script setup lang="ts">
import { useEtherStore } from "@/store/ether";
import { storeToRefs } from "pinia";
import { ref, watch, onMounted } from "vue";
import ListingComponent from "@/components/ListingComponent.vue";
import { listAllTransactionByWalletAddress } from "@/blockchain/wallet";
import type { Event } from "ethers";
import type { ValidDeposit } from "@/model/ValidDeposit";

const etherStore = useEtherStore();
const { walletAddress, networkName } = storeToRefs(etherStore);
const allUserTransactions = ref<(Event | ValidDeposit)[]>([]);

onMounted(async () => {
  if (walletAddress.value) {
  await listAllTransactionByWalletAddress(walletAddress.value).then((res) => {
    if (res) allUserTransactions.value = res;
  });
}
})

watch(walletAddress, async (newValue) => {
  await listAllTransactionByWalletAddress(newValue).then((res) => {
    if (res) allUserTransactions.value = res;
  });
});

watch(networkName, async () => {
  await listAllTransactionByWalletAddress(walletAddress.value).then((res) => {
    if (res) allUserTransactions.value = res;
  });
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
