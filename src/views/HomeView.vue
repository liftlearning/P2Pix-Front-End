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
const { loadingLock, walletAddress } = storeToRefs(etherStore);
const flowStep = ref<Step>(Step.Search);
const pixTarget = ref<string>("");
const tokenAmmount = ref<number>();
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
  tokenAmmount.value = tokenValue;
  pixTarget.value = depositDetail?.pixTarget;

  // Makes lock with deposit ID and the Amount
  if (depositDetail) {
    flowStep.value = Step.Buy;
    etherStore.setLoadingLock(true);

    await blockchain.addLock(depositId, tokenValue).catch(() => {
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

const releaseTransaction = async ({ pixE2Eid }: any) => {
  console.log("release: ", pixE2Eid);
  flowStep.value = Step.List;
  loadingRelease.value = true;

  lastWalletTransactions.value =
    await blockchain.listTransactionByWalletAddress(
      walletAddress.value.toLowerCase()
    );

  setTimeout(() => (loadingRelease.value = false), 2000);
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
      :tokenValue="tokenAmmount"
      @pix-validated="releaseTransaction"
      v-if="!loadingLock"
    />
    <ValidationComponent
      v-if="loadingLock"
      :message="'A transação está sendo enviada para a rede'"
    />
  </div>
  <div v-if="flowStep == Step.List">
    <ListComponent v-if="!loadingRelease" :tokenAmmount="tokenAmmount" />
    <ValidationComponent
      v-if="loadingRelease"
      :message="'A transação está sendo enviada para a rede. Em breve os tokens serão depositados em sua carteira.'"
    />
  </div>
</template>

<style scoped></style>
