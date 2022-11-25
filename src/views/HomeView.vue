<script setup lang="ts">
import SearchComponent from "../components/SearchComponent.vue";

const confirmBuyClick = () => {
  // finish buy screen
  console.log("compra confirmada");
};
</script>

<template>
  <SearchComponent @token-buy="confirmBuyClick()" />
</template>

<style scoped></style>
