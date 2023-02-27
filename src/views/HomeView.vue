<script setup lang="ts">
import SearchComponent from "@/components/SearchComponent.vue";
import LoadingComponent from "@/components/LoadingComponent/LoadingComponent.vue";
import BuyConfirmedComponent from "@/components/BuyConfirmedComponent/BuyConfirmedComponent.vue";
import ListingComponent from "@/components/ListingComponent/ListingComponent.vue";
import { ref, onMounted, watch } from "vue";
import { useEtherStore } from "@/store/ether";
import QrCodeComponent from "@/components/QrCodeComponent.vue";
import CustomModal from "@/components/CustomModal/CustomModal.vue";
import { storeToRefs } from "pinia";
import {
  addLock,
  releaseLock,
  withdrawDeposit,
} from "@/blockchain/buyerMethods";
import {
  updateWalletStatus,
  listAllTransactionByWalletAddress,
  checkUnreleasedLock,
  listValidDepositTransactionsByWalletAddress,
} from "@/blockchain/wallet";
import { getNetworksLiquidity } from "@/blockchain/events";
import type { ValidDeposit } from "@/model/ValidDeposit";
import type { WalletTransaction } from "@/model/WalletTransaction";
import CustomAlert from "@/components/CustomAlert/CustomAlert.vue";

enum Step {
  Search,
  Buy,
  List,
}

const etherStore = useEtherStore();
etherStore.setSellerView(false);

// States
const { loadingLock, walletAddress, networkName } = storeToRefs(etherStore);
const flowStep = ref<Step>(Step.Search);
const pixTarget = ref<number>();
const tokenAmount = ref<number>();
const lockID = ref<string>("");
const loadingRelease = ref<boolean>(false);
const showModal = ref<boolean>(false);
const lastWalletTransactions = ref<WalletTransaction[]>([]);
const depositList = ref<ValidDeposit[]>([]);
const showBuyAlert = ref<boolean>(false);

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

    await addLock(selectedDeposit.seller, selectedDeposit.token, tokenValue)
      .then((_lockID) => {
        lockID.value = _lockID;
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
  showBuyAlert.value = true;
  loadingRelease.value = true;

  if (lockID.value && tokenAmount.value && pixTarget.value) {
    const release = await releaseLock(
      pixTarget.value,
      tokenAmount.value,
      e2eId,
      lockID.value
    );
    release.wait();

    await getWalletTransactions();

    await updateWalletStatus();
    loadingRelease.value = false;
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
      lastWalletTransactions.value = allUserTransactions;
    }
  }
  etherStore.setLoadingWalletTransactions(false);
};

const callWithdraw = async (amount: string) => {
  if (amount) {
    etherStore.setLoadingWalletTransactions(true);
    const withdraw = await withdrawDeposit(amount);
    if (withdraw) {
      console.log("Saque realizado!");
      await getWalletTransactions();
    } else {
      console.log("Não foi possível realizar o saque!");
    }
    etherStore.setLoadingWalletTransactions(false);
  }
};

const checkForUnreleasedLocks = async (): Promise<void> => {
  const walletLocks = await checkUnreleasedLock(walletAddress.value);
  if (walletLocks) {
    lockID.value = walletLocks.lockID;
    tokenAmount.value = walletLocks.pix.value;
    pixTarget.value = Number(walletLocks.pix.pixKey);
    showModal.value = true;
  } else {
    flowStep.value = Step.Search;
    showModal.value = false;
  }
};

if (walletAddress.value) {
  await checkForUnreleasedLocks();
}

watch(walletAddress, async () => {
  await checkForUnreleasedLocks();
});

watch(networkName, async () => {
  if (walletAddress.value) await checkForUnreleasedLocks();
});

onMounted(async () => {
  await getNetworksLiquidity();
});
</script>

<template>
  <SearchComponent
    v-if="flowStep == Step.Search"
    @token-buy="confirmBuyClick"
  />
  <CustomAlert
    v-if="flowStep == Step.Search && showModal"
    :type="'redirect'"
    @close-alert="showModal = false"
    @go-to-lock="flowStep = Step.Buy"
  />
  <CustomAlert
    v-if="
      flowStep == Step.List && showBuyAlert && !loadingLock && !loadingRelease
    "
    :type="'buy'"
    @close-alert="showBuyAlert = false"
  />
  <div v-if="flowStep == Step.Buy">
    <QrCodeComponent
      :pixTarget="String(pixTarget)"
      :tokenValue="tokenAmount"
      @pix-validated="releaseTransaction"
      v-if="!loadingLock"
    />
    <LoadingComponent
      v-if="loadingLock"
      :message="'A transação está sendo enviada para a rede'"
    />
  </div>
  <div v-if="flowStep == Step.List">
    <div class="flex flex-col gap-10" v-if="!loadingRelease">
      <BuyConfirmedComponent
        :tokenAmount="tokenAmount"
        @make-another-transaction="flowStep = Step.Search"
      />
      <div
        class="text-3xl text-white leading-9 font-bold justify-center flex mt-4"
      >
        Gerenciar transações
      </div>
      <ListingComponent
        :valid-deposits="depositList"
        :wallet-transactions="lastWalletTransactions"
        @deposit-withdrawn="callWithdraw"
      ></ListingComponent>
    </div>
    <LoadingComponent
      v-if="loadingRelease"
      :message="'A transação está sendo enviada para a rede. Em breve os tokens serão depositados em sua carteira.'"
    />
  </div>
</template>
