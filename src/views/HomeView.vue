<script setup lang="ts">
import SearchComponent from "../components/SearchComponent.vue";
import ValidationComponent from "../components/LoadingComponent.vue";
import ListComponent from "@/components/ListComponent.vue";
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

// States
const etherStore = useEtherStore();
const { loadingLock, walletAddress, locksAddedList } = storeToRefs(etherStore);
const flowStep = ref<Step>(Step.Search);
const pixTarget = ref<string>("");
const tokenAmount = ref<number>();
const lockTransactionHash = ref<string>("");
const lockId = ref<string>("");
const loadingRelease = ref<Boolean>(false);
const lastWalletTransactions = ref<any[] | undefined>([]);

const confirmBuyClick = async ({ selectedDeposit, tokenValue }: any) => {
  // finish buy screen
  console.log(selectedDeposit);
  let depositDetail;
  const depositId = selectedDeposit["args"]["depositID"];
  await blockchain
    .mapDeposits(depositId)
    .then((deposit) => (depositDetail = deposit));
  tokenAmount.value = tokenValue;
  pixTarget.value = depositDetail?.pixTarget;

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

  const findLockId = locksAddedList.value.find((element) => {
    if (element.transactionHash === lockTransactionHash.value) {
      lockId.value = element.args.lockID;
      return true;
    }
    return false;
  });

  if (findLockId) {
    console.log(
      pixTarget.value,
      String(tokenAmount.value),
      Number(e2eId),
      lockId.value
    );

    const release = await blockchain.releaseLock(
      pixTarget.value,
      String(tokenAmount.value),
      Number(e2eId),
      lockId.value
    );
    release.wait();

    lastWalletTransactions.value =
      await blockchain.listTransactionByWalletAddress(
        walletAddress.value.toLowerCase()
      );

    console.log(tokenAmount);

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
    <ListComponent
      v-if="!loadingRelease"
      :tokenAmount="tokenAmount"
      :last-wallet-transactions="lastWalletTransactions"
    />
    <ValidationComponent
      v-if="loadingRelease"
      :message="'A transação está sendo enviada para a rede. Em breve os tokens serão depositados em sua carteira.'"
    />
  </div>
</template>

<style scoped></style>
