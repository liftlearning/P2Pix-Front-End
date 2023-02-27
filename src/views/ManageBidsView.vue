<script setup lang="ts">
import { useEtherStore } from "@/store/ether";
import { storeToRefs } from "pinia";
import ListingComponent from "@/components/ListingComponent/ListingComponent.vue";
import LoadingComponent from "@/components/LoadingComponent/LoadingComponent.vue";
import { ref, watch, onMounted } from "vue";
import {
  listValidDepositTransactionsByWalletAddress,
  listAllTransactionByWalletAddress,
checkUnreleasedLock,
} from "@/blockchain/wallet";
import { withdrawDeposit } from "@/blockchain/buyerMethods";
import type { ValidDeposit } from "@/model/ValidDeposit";
import type { WalletTransaction } from "@/model/WalletTransaction";

import router from "@/router/index";
import CustomAlert from "@/components/CustomAlert/CustomAlert.vue";

const etherStore = useEtherStore();

const { walletAddress, networkName } = storeToRefs(etherStore);
const loadingWithdraw = ref<boolean>(false);

const depositList = ref<ValidDeposit[]>([]);
const transactionsList = ref<WalletTransaction[]>([]);
const showAlert = ref<boolean>(false);

const callWithdraw = async (amount: string) => {
  if (amount) {
    loadingWithdraw.value = true;
    let withdraw;
    try {
      withdraw = await withdrawDeposit(amount);
    } catch {
      loadingWithdraw.value = false;
    }

    if (withdraw) {
      console.log("Saque realizado!");
      await getWalletTransactions();
    } else {
      console.log("Não foi possível realizar o saque!");
    }
    loadingWithdraw.value = false;
  }
};

const getWalletTransactions = async () => {
  etherStore.setLoadingWalletTransactions(true);
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
  etherStore.setLoadingWalletTransactions(false);
};

const checkForUnreleasedLocks = async (): Promise<void> => {
  const walletLocks = await checkUnreleasedLock(walletAddress.value);
  if (walletLocks) {
    showAlert.value = true;
  } else {
    showAlert.value = false;
  }
};

const goToLock = () => {
  router.push({ name: "home" });
};

onMounted(async () => {
  if (!walletAddress.value) {
    router.push({ name: "home" });
  }
  await getWalletTransactions();
  await checkForUnreleasedLocks();
});

watch(walletAddress, async () => {
  await getWalletTransactions();
});

watch(networkName, async () => {
  await getWalletTransactions();
});
</script>

<template>
  <CustomAlert
    v-if="showAlert"
    :type="'redirect'"
    @close-alert="showAlert = false"
    @go-to-lock="goToLock()"
  />
  <div class="page">
    <div class="header" v-if="!loadingWithdraw && !walletAddress">
      Por Favor Conecte Sua Carteira
    </div>
    <div class="header" v-if="!loadingWithdraw && walletAddress">
      Gerenciar Ofertas
    </div>
    <div class="w-full max-w-4xl">
      <ListingComponent
        v-if="!loadingWithdraw && walletAddress"
        :valid-deposits="depositList"
        :wallet-transactions="transactionsList"
        @deposit-withdrawn="callWithdraw"
      ></ListingComponent>
      <LoadingComponent
        v-if="loadingWithdraw"
        :message="'A transação está sendo enviada para a rede. Em breve os tokens serão depositados em sua carteira.'"
      />
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
