<script setup lang="ts">
import TopBar from "./components/TopBar.vue";
</script>

<template>
  <TopBar />
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <Suspense>
        <component :is="Component"></component>
      </Suspense>
    </template>
  </RouterView>
</template>

<style scoped></style>
