<script setup lang="ts">
import SearchComponent from "../components/SearchComponent.vue";

const confirmBuyClick = ({ selectedDeposit, tokenValue }: any) => {
  // finish buy screen
  console.log(selectedDeposit);
  console.log(tokenValue);
  console.log("compra confirmada");
};
</script>

<template>
  <SearchComponent @token-buy="confirmBuyClick" />
</template>

<style scoped></style>
