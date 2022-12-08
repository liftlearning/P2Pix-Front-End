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

const confirmBuyClick = async ({ selectedDeposit, tokenValue }: any) => {
  // finish buy screen
  console.log(selectedDeposit);
  let depositDetail;
  await blockchain
    .mapDeposits(selectedDeposit.args.depositID)
    .then((deposit) => (depositDetail = deposit));
    
  console.log(tokenValue);
  tokenAmmount.value = tokenValue
  flowStep.value = Step.List

  // Makes lock with deposit ID and the Amount
  if (depositDetail) {
    const lock = await blockchain.addLock(
      selectedDeposit.args.depositID,
      tokenValue
    );
    console.log(lock);
  };

};  
</script>

<template>
  <SearchComponent v-if="(flowStep == Step.Search)" @token-buy="confirmBuyClick" />
  <Suspense>
    <ListComponent v-if="(flowStep == Step.List)" :tokenAmmount="tokenAmmount" />
    <template #fallback>
      Carregando...
    </template>
  </Suspense>
</template>

<style scoped></style>
