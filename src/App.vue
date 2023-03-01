<script setup lang="ts">
import TopBar from "@/components/TopBar/TopBar.vue";
import SpinnerComponent from "@/components/SpinnerComponent.vue";
</script>

<template>
  <TopBar />
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <Suspense>
        <component :is="Component"></component>
        <template #fallback>
          <div class="flex w-full h-full justify-center items-center">
            <SpinnerComponent :width="'16'" :height="'16'"></SpinnerComponent>
          </div>
        </template>
      </Suspense>
    </template>
  </RouterView>
</template>
