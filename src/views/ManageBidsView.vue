<script setup lang="ts">
import { useEtherStore } from "@/store/ether";
import { storeToRefs } from "pinia";
import ListingComponent from "@/components/ListingComponent.vue";

const etherStore = useEtherStore();
const { depositsAddedList } = storeToRefs(etherStore);
</script>

<template>
  <div class="page">
    <div class="header">Gerenciar ofertas</div>
    <ListingComponent
      :wallet-transactions="depositsAddedList"
      :is-manage-mode="true"
    ></ListingComponent>
  </div>
</template>

<style scoped>
.page {
  @apply flex flex-col gap-10 mt-20 w-full;
}

.header {
  @apply text-3xl text-gray-900 leading-9 font-bold justify-center flex;
}
</style>
