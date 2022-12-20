<script setup lang="ts">
import WantSellComponent from "../components/SellerSteps/WantSellComponent.vue";
import SendNetwork from "../components/SellerSteps/SendNetwork.vue";
import ValidationComponent from "../components/LoadingComponent.vue";

import { ref } from "vue";
import router from "@/router";

enum Step {
  Search,
  Sell,
  Network,
}

const flowStep = ref<Step>(Step.Sell);
const loading = ref<boolean>(false);

const walletConnect = async () => {
  flowStep.value = Step.Sell;
};

const approveTokens = async () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    flowStep.value = Step.Network;
  }, 2000);
};

const sendNetwork = async () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    router.push("/");
  }, 2000);
};
</script>

<template>
  <!-- <SellerSearchComponent
    v-if="flowStep == Step.Search"
    @token-buy="walletConnect"
  /> -->
  <div v-if="flowStep == Step.Sell">
    <WantSellComponent v-if="!loading" @approve-tokens="approveTokens" />
    <ValidationComponent
      v-if="loading"
      :message="'A transação está sendo enviada para a rede.'"
    />
  </div>
  <div v-if="flowStep == Step.Network">
    <SendNetwork v-if="!loading" @send-network="sendNetwork" />
    <ValidationComponent
      v-if="loading"
      :message="'A transação está sendo enviada para a rede.'"
    />
  </div>
</template>

<style scoped></style>
