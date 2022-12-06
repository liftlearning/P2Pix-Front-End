<script setup lang="ts">
import SearchComponent from "../components/SearchComponent.vue";
import blockchain from "../utils/blockchain";
import ListComponent from "@/components/ListComponent.vue";
import { ref } from "vue";

enum Step {
  Search,
  Buy,
  List
}

const flowStep = ref<Step>(Step.Search)
const tokenAmmount = ref()

// (TO DO) Tirar isso tudo daqui
// import p2pix from "../utils/smart_contract_files/P2PIX.json";
// import addresses from "../utils/smart_contract_files/localhost.json";
// import { useEtherStore } from "@/store/ether";
// import { ethers } from "ethers";

const confirmBuyClick = async ({ selectedDeposit, tokenValue }: any) => {
  // finish buy screen
  console.log(selectedDeposit);
  let depositDetail;
  await blockchain
    .mapDeposits(selectedDeposit["args"]["depositID"])
    .then((deposit) => (depositDetail = deposit));
    
  console.log(tokenValue);
  tokenAmmount.value = tokenValue
  flowStep.value = Step.List
  console.log(depositDetail);
  console.log(depositDetail);

  // Makes lock with deposit ID and the Amount
  // if (depositDetail) {
  //   const lock = await blockchain.addLock(
  //     depositDetail.args.depositID,
  //     tokenValue
  //   );
  //   console.log(lock);

  //   // (TO DO) Tirar isso daqui
  //   const window_ = window as any;
  //   const connection = window_.ethereum;
  //   let provider: ethers.providers.Web3Provider | null = null;
  //   if (!connection) return;
  //   provider = new ethers.providers.Web3Provider(connection);
  //   const signer = provider.getSigner();
  //   const etherStore = useEtherStore();
  //   const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);
  //   const filterLocks = p2pContract.filters.LockAdded(null);
  //   const eventsLocks = await p2pContract.queryFilter(filterLocks);
  //   etherStore.setLocksAddedList(eventsLocks);

    // Data to QRCode
    // Chave Pix = depositDetail.pixTarget
    // Valor = tokenValue
  // }
};
</script>

<template>
  <SearchComponent v-if="(flowStep == Step.Search)" @token-buy="confirmBuyClick" />
  <ListComponent v-if="(flowStep == Step.List)" :tokenAmmount="tokenAmmount" />
</template>

<style scoped></style>
