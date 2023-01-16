<script setup lang="ts">
import SearchComponent from "../components/SearchComponent.vue";
import ValidationComponent from "../components/LoadingComponent.vue";
import BuyConfirmedComponent from "@/components/BuyConfirmedComponent/BuyConfirmedComponent.vue";
import blockchain from "../utils/blockchain";
import { ref } from "vue";

import { useEtherStore } from "@/store/ether";
import QrCodeComponent from "../components/QrCodeComponent.vue";
import { storeToRefs } from "pinia";

enum Step {
  Search,
  Buy,
  List,
}

const etherStore = useEtherStore();
etherStore.setSellerView(false);

// States
const { loadingLock, walletAddress, locksAddedList } = storeToRefs(etherStore);
const flowStep = ref<Step>(Step.Search);
const pixTarget = ref<string>("");
const tokenAmount = ref<number>();
const lockTransactionHash = ref<string>("");
const lockId = ref<string>("");
const loadingRelease = ref<Boolean>(false);
const lastWalletReleaseTransactions = ref<any[]>([]);

const confirmBuyClick = async ({ selectedDeposit, tokenValue }: any) => {
  // finish buy screen
  const depositDetail = selectedDeposit;
  const depositId = selectedDeposit.depositID;
  pixTarget.value = selectedDeposit.pixKey;
  tokenAmount.value = tokenValue;

  // Makes lock with deposit ID and the Amount
  if (depositDetail) {
    flowStep.value = Step.Buy;
    etherStore.setLoadingLock(true);

    await blockchain
      .addLock(depositId, tokenValue)
      .then((lock) => {
        lockTransactionHash.value = lock.hash;
      })
      .catch(() => {
        flowStep.value = Step.Search;
      });

    etherStore.setLoadingLock(false);
  }
};

const releaseTransaction = async ({ e2eId }: any) => {
  flowStep.value = Step.List;
  loadingRelease.value = true;

  const findLock = locksAddedList.value.find((element) => {
    if (element.transactionHash === lockTransactionHash.value) {
      lockId.value = element.args.lockID;
      return true;
    }
    return false;
  });

  if (findLock && tokenAmount.value) {
    const release = await blockchain.releaseLock(
      pixTarget.value,
      tokenAmount.value,
      e2eId,
      lockId.value
    );
    release.wait();

    await blockchain
      .listReleaseTransactionByWalletAddress(walletAddress.value.toLowerCase())
      .then((releaseTransactions) => {
        if (releaseTransactions)
          lastWalletReleaseTransactions.value = releaseTransactions;
      });

    await blockchain.updateWalletStatus();
    loadingRelease.value = false;
  }
};
</script>

<template>
  <SearchComponent
    v-if="flowStep == Step.Search"
    @token-buy="confirmBuyClick"
  />
  <div v-if="flowStep == Step.Buy">
    <QrCodeComponent
      :pixTarget="pixTarget"
      :tokenValue="tokenAmount"
      @pix-validated="releaseTransaction"
      v-if="!loadingLock"
    />
    <ValidationComponent
      v-if="loadingLock"
      :message="'A transação está sendo enviada para a rede'"
    />
  </div>
  <div v-if="flowStep == Step.List">
    <BuyConfirmedComponent
      v-if="!loadingRelease"
      :last-wallet-release-transactions="lastWalletReleaseTransactions"
      :tokenAmount="tokenAmount"
      @make-another-transaction="flowStep = Step.Search"
    />
    <ValidationComponent
      v-if="loadingRelease"
      :message="'A transação está sendo enviada para a rede. Em breve os tokens serão depositados em sua carteira.'"
    />
  </div>
</template>

<style scoped></style>
