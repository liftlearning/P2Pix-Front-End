<script setup lang="ts">
import { useEtherStore } from "@/store/ether";
import { storeToRefs } from "pinia";
import ListingComponent from "@/components/ListingComponent/ListingComponent.vue";
import { ref, watch, onMounted } from "vue";
import {
  listValidDepositTransactionsByWalletAddress,
  listAllTransactionByWalletAddress,
} from "@/blockchain/wallet";
import type { ValidDeposit } from "@/model/ValidDeposit";
import type { Event } from "ethers";

const etherStore = useEtherStore();

const { walletAddress, networkName } = storeToRefs(etherStore);
const depositList = ref<ValidDeposit[]>([]);
const transactionsList = ref<Event[]>([]);

const updateRemaining = async () => {
  const walletDeposits = await listValidDepositTransactionsByWalletAddress(
    walletAddress.value
  );
  depositList.value = walletDeposits;

  const allUserTransactions = await listAllTransactionByWalletAddress(
    walletAddress.value
  );
  transactionsList.value = allUserTransactions;
};

onMounted(async () => {
  if (walletAddress.value) {
    const walletDeposits = await listValidDepositTransactionsByWalletAddress(
      walletAddress.value
    );

    const allUserTransactions = await listAllTransactionByWalletAddress(
      walletAddress.value
    );

    if (walletDeposits) {
      depositList.value = walletDeposits;
    }
    if (allUserTransactions) {
      transactionsList.value = allUserTransactions;
    }
  }
});

watch(walletAddress, async (newValue) => {
  await listValidDepositTransactionsByWalletAddress(newValue)
    .then((res) => {
      if (res) depositList.value = res;
    })
    .catch(() => {
      depositList.value = [];
    });

  await listAllTransactionByWalletAddress(newValue)
    .then((res) => {
      if (res) transactionsList.value = res;
    })
    .catch(() => {
      transactionsList.value = [];
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

  await listAllTransactionByWalletAddress(walletAddress.value)
    .then((res) => {
      if (res) transactionsList.value = res;
    })
    .catch(() => {
      transactionsList.value = [];
    });
});
</script>

<template>
  <div class="page">
    <div class="header">Gerenciar Ofertas</div>
    <div class="w-full max-w-4xl">
      <ListingComponent
        :valid-deposits="depositList"
        :wallet-transactions="transactionsList"
        @deposit-withdrawn="updateRemaining"
      ></ListingComponent>
    </div>
  </div>
</template>

<style scoped>
.page {
  @apply flex flex-col items-center gap-10 mt-20 w-full;
}

.header {
  @apply text-3xl text-white leading-9 font-bold justify-center flex;
}
</style>
