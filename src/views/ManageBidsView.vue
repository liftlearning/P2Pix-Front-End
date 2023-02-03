<script setup lang="ts">
import { useEtherStore } from "@/store/ether";
import { storeToRefs } from "pinia";
import ListingComponent from "@/components/ListingComponent/ListingComponent.vue";
import type { BigNumber } from "ethers";
import { ref, watch, onMounted } from "vue";
import { cancelDeposit, withdrawDeposit } from "@/blockchain/buyerMethods";
import { listValidDepositTransactionsByWalletAddress } from "@/blockchain/wallet";
import type { ValidDeposit } from "@/model/ValidDeposit";

const etherStore = useEtherStore();

const { walletAddress, networkName } = storeToRefs(etherStore);
const depositList = ref<ValidDeposit[]>([]);

onMounted(async () => {
  if (walletAddress.value) {
    const walletDeposits = await listValidDepositTransactionsByWalletAddress(
      walletAddress.value
    );
    if (walletDeposits) {
      depositList.value = walletDeposits;
    }
  }
});

const handleCancelDeposit = async (depositID: BigNumber, index: number) => {
  const response = await cancelDeposit(depositID);
  if (response) {
    console.log("Depósito cancelado com sucesso.");
    depositList.value.splice(index, 1);
  }
};

const handleWithDrawDeposit = async (depositID: BigNumber, index: number) => {
  const response = await withdrawDeposit(depositID);
  if (response) {
    console.log("Token retirado com sucesso.");
    depositList.value.splice(index, 1);
  }
};

watch(walletAddress, async () => {
  await listValidDepositTransactionsByWalletAddress(walletAddress.value)
    .then((res) => {
      if (res) depositList.value = res;
    })
    .catch(() => {
      depositList.value = [];
    });
});

watch(networkName, async () => {
  await listValidDepositTransactionsByWalletAddress(walletAddress.value)
    .then((res) => {
      if (res) depositList.value = res;
    })
    .catch(() => {
      depositList.value = [];
    });
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
