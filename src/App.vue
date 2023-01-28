<script setup lang="ts">
import TopBar from "./components/TopBar/TopBar.vue";
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
