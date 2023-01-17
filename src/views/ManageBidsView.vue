<script setup lang="ts">
import { useEtherStore } from "@/store/ether";
import { storeToRefs } from "pinia";
import ListingComponent from "@/components/ListingComponent.vue";
import type { BigNumber } from "ethers";
import { ref, watch } from "vue";
import { cancelDeposit, withdrawDeposit } from "@/blockchain/buyerMethods";
import { listValidDepositTransactionsByWalletAddress } from "@/blockchain/wallet";

const etherStore = useEtherStore();

const { walletAddress } = storeToRefs(etherStore);
const depositList = ref<any[]>([]);

if (walletAddress.value) {
  const walletDeposits = await listValidDepositTransactionsByWalletAddress(
    walletAddress.value
  );
  if (walletDeposits) {
    depositList.value = walletDeposits;
  }
}

const handleCancelDeposit = async (depositID: BigNumber, index: number) => {
  const response = await cancelDeposit(depositID);
  if (response == true) {
    console.log("Depósito cancelado com sucesso.");
    depositList.value.splice(index, 1);
  }
};

const handleWithDrawDeposit = async (depositID: BigNumber, index: number) => {
  const response = await withdrawDeposit(depositID);
  if (response == true) {
    console.log("Token retirado com sucesso.");
    depositList.value.splice(index, 1);
  }
};

watch(walletAddress, async () => {
  const walletDeposits = await listValidDepositTransactionsByWalletAddress(
    walletAddress.value
  );
  if (walletDeposits) {
    depositList.value = walletDeposits;
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
