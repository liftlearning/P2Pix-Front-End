<script setup lang="ts">
import SearchComponent from "../components/SearchComponent.vue";
import ValidationComponent from "../components/ValidationComponent.vue";
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
}

// States
const etherStore = useEtherStore();
const { loadingLock } = storeToRefs(etherStore);
const flowStep = ref<Step>(Step.Search);
const pixTarget = ref<string>("");
const tokens = ref<number>();

const confirmBuyClick = async ({ selectedDeposit, tokenValue }: any) => {
  // finish buy screen
  console.log(selectedDeposit);
  let depositDetail;
  const depositId = selectedDeposit["args"]["depositID"];
  await blockchain
    .mapDeposits(depositId)
    .then((deposit) => (depositDetail = deposit));
  tokens.value = tokenValue;
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

const disconnectUser = ({}: any) => {
  console.log('entrou')
  etherStore.setWalletAddress("");
  flowStep.value == Step.Search;
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
      :tokenValue="tokens"
      v-if="!loadingLock"
    />
    <ValidationComponent v-if="loadingLock" />
  </div>
  <div @disconnect-user="disconnectUser"></div>
</template>

<style scoped></style>
