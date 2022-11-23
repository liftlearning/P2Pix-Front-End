<script setup lang="ts">
const props = defineProps({
  text: String,
  isDisabled: Boolean,
});

const emit = defineEmits(["clicked"]);
</script>

<template>
  <button
    type="button"
    class="button"
    @click="emit('clicked')"
    v-bind:class="{ 'opacity-70': isDisabled }"
    :disabled="isDisabled"
  >
    {{ text }}
  </button>
</template>

<style scoped>
.button {
  @apply rounded-lg w-full text-base font-semibold text-gray-900 py-4 bg-amber-400;
}
</style>
