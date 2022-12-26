<script setup lang="ts">
import { useEtherStore } from "@/store/ether";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import ListingComponent from "@/components/ListingComponent.vue";
import blockchain from "../utils/blockchain";

const etherStore = useEtherStore();
const { walletAddress } = storeToRefs(etherStore);
const allUserTransactions = ref<any[]>([]);

if (walletAddress.value != "") {
  blockchain
    .listAllTransactionByWalletAddress(walletAddress.value)
    .then((res) => {
      allUserTransactions.value = res;
    });
}
</script>

<template>
  <div class="page">
    <div class="header">Histórico de Depósitos</div>
    <ListingComponent
      v-if="walletAddress != '' && allUserTransactions.length != 0"
      :wallet-transactions="allUserTransactions"
      :is-manage-mode="false"
    ></ListingComponent>
    <div v-if="walletAddress == ''">
      Conecte sua carteira para ver o histórico
    </div>
    <div v-if="allUserTransactions.length == 0 && walletAddress != ''">
      Carregando dados...
    </div>
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
