<script setup lang="ts">
import SearchComponent from "../components/SearchComponent.vue";
import blockchain from "../utils/blockchain";

const confirmBuyClick = async ({ selectedDeposit, tokenValue }: any) => {
  // finish buy screen
  console.log(selectedDeposit);
  let depositDetail;
  await blockchain
    .mapDeposits(selectedDeposit["args"]["depositID"])
    .then((deposit) => (depositDetail = deposit));
  console.log(tokenValue);
  console.log(depositDetail);
};
</script>

<template>
  <SearchComponent @token-buy="confirmBuyClick" />
</template>

<style scoped></style>
