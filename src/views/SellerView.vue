<script setup lang="ts">
import WantSellComponent from "../components/SellerSteps/WantSellComponent.vue";
import SendNetwork from "../components/SellerSteps/SendNetwork.vue";
import ValidationComponent from "../components/LoadingComponent.vue";
import blockchain from "../utils/blockchain";

import { ref } from "vue";
import { useEtherStore } from "@/store/ether";

enum Step {
  Search,
  Sell,
  Network,
}

const etherStore = useEtherStore();
etherStore.setSellerView(true);

const flowStep = ref<Step>(Step.Sell);
const loading = ref<boolean>(false);

const offerValue = ref<number>();
const pixKeyBuyer = ref<string>("");

// Verificar tipagem
const approveOffer = async ({ offer, pixKey }: any) => {
  loading.value = true;
  try {
    offerValue.value = offer;
    pixKeyBuyer.value = pixKey;
    await blockchain.approveTokens(Number(offerValue.value));
    flowStep.value = Step.Network;
    loading.value = false;
  } catch {
    flowStep.value = Step.Sell;
    loading.value = false;
  }
};

const sendNetwork = async () => {
  loading.value = true;
  try {
    if (offerValue.value && pixKeyBuyer.value) {
      await blockchain.addDeposit(offerValue.value, pixKeyBuyer.value);
      flowStep.value = Step.Sell;
      loading.value = false;
    }
  } catch (err) {
    console.log(err);
    flowStep.value = Step.Network;
    loading.value = false;
  }
};
</script>

<template>
  <div v-if="flowStep == Step.Sell">
    <WantSellComponent v-if="!loading" @approve-tokens="approveOffer" />
    <ValidationComponent
      v-if="loading"
      :message="'A transação está sendo enviada para a rede.'"
    />
  </div>
  <div v-if="flowStep == Step.Network">
    <SendNetwork
      :pixKey="pixKeyBuyer"
      :offer="Number(offerValue)"
      v-if="!loading"
      @send-network="sendNetwork"
    />
    <ValidationComponent
      v-if="loading"
      :message="'A transação está sendo enviada para a rede.'"
    />
  </div>
</template>

<style scoped></style>
