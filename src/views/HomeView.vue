<script setup lang="ts">
import SearchComponent from "../components/SearchComponent.vue";
import ValidationComponent from "../components/LoadingComponent.vue";
import ListComponent from "@/components/ListComponent.vue";
import blockchain from "../utils/blockchain";
import { ref } from "vue";

// (TO DO) Tirar isso tudo daqui
import p2pix from "../utils/smart_contract_files/P2PIX.json";
import addresses from "../utils/smart_contract_files/localhost.json";
import { useEtherStore } from "@/store/ether";
import { ethers } from "ethers";
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

    await blockchain.addLock(depositId, tokenValue)
    .then((lock) => {
      console.log(lock)
      lockTransactionHash.value = lock.hash
    })
    .catch(() => {
      flowStep.value = Step.Search;
    });

    // (TO DO) Tirar isso daqui
    const window_ = window as any;
    const connection = window_.ethereum;
    let provider: ethers.providers.Web3Provider | null = null;
    if (!connection) return;
    provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);
    const filterLocks = p2pContract.filters.LockAdded(null);
    const eventsLocks = await p2pContract.queryFilter(filterLocks);
    etherStore.setLocksAddedList(eventsLocks);
    etherStore.setLoadingLock(false);

    // Data to QRCode
    // Chave Pix = depositDetail.pixTarget
    // Valor = tokenValue
  }
};

const releaseTransaction = async ({ e2eId }: any) => {
  console.log(e2eId);
  flowStep.value = Step.List;
  loadingRelease.value = true;
  console.log(lockTransactionHash.value);
  console.log(locksAddedList.value);

  // make lock release
  // need to find lockId
  // const release = await blockchain.releaseLock(pixTarget.value, String(tokenAmount.value), Number(e2eId), lockTransactionHash.value)
  // console.log(release);

  lastWalletTransactions.value =
    await blockchain.listTransactionByWalletAddress(
      walletAddress.value.toLowerCase()
    );

  loadingRelease.value = false
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
    <ListComponent v-if="!loadingRelease" :tokenAmount="tokenAmount" :last-wallet-transactions="lastWalletTransactions" />
    <ValidationComponent
      v-if="loadingRelease"
      :message="'A transação está sendo enviada para a rede. Em breve os tokens serão depositados em sua carteira.'"
    />
  </div>
</template>

<style scoped></style>
