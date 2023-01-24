<script setup lang="ts">
import SearchComponent from "../components/SearchComponent.vue";
import ValidationComponent from "../components/LoadingComponent.vue";
import BuyConfirmedComponent from "@/components/BuyConfirmedComponent.vue";
import { ref, onMounted } from "vue";
import { useEtherStore } from "@/store/ether";
import QrCodeComponent from "../components/QrCodeComponent.vue";
import { storeToRefs } from "pinia";
import { addLock, releaseLock } from "@/blockchain/buyerMethods";
import { updateWalletStatus } from "@/blockchain/wallet";
import { getNetworksLiquidity } from "@/blockchain/events";
import { listReleaseTransactionByWalletAddress } from "@/blockchain/wallet";
import type { Event } from "ethers";
import type { ValidDeposit } from "@/model/ValidDeposit";

enum Step {
  Search,
  Buy,
  List,
}

const etherStore = useEtherStore();
etherStore.setSellerView(false);

// States
const { loadingLock, walletAddress } = storeToRefs(etherStore);
const flowStep = ref<Step>(Step.Search);
const pixTarget = ref<string>("");
const tokenAmount = ref<number>();
const _lockID = ref<string>("");
const loadingRelease = ref<boolean>(false);
const lastWalletReleaseTransactions = ref<Event[]>([]);

const confirmBuyClick = async (
  selectedDeposit: ValidDeposit,
  tokenValue: number
) => {
  // finish buy screen
  pixTarget.value = selectedDeposit.pixKey;
  tokenAmount.value = tokenValue;

  // Makes lock with deposit ID and the Amount
  if (selectedDeposit) {
    flowStep.value = Step.Buy;
    etherStore.setLoadingLock(true);

    await addLock(selectedDeposit.depositID, tokenValue)
      .then((lockID) => {
        _lockID.value = lockID;
      })
      .catch((err) => {
        console.log(err);
        flowStep.value = Step.Search;
      });

    etherStore.setLoadingLock(false);
  }
};

const releaseTransaction = async (e2eId: string) => {
  flowStep.value = Step.List;
  loadingRelease.value = true;

  if (_lockID.value && tokenAmount.value) {
    const release = await releaseLock(
      pixTarget.value,
      tokenAmount.value,
      e2eId,
      _lockID.value
    );
    release.wait();

    await listReleaseTransactionByWalletAddress(
      walletAddress.value.toLowerCase()
    ).then((releaseTransactions) => {
      if (releaseTransactions)
        lastWalletReleaseTransactions.value = releaseTransactions;
    });

    await updateWalletStatus();
    loadingRelease.value = false;
  }
};

onMounted(async () => {
  await getNetworksLiquidity();
});
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
