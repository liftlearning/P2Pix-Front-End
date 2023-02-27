<script setup lang="ts">
import { ref } from "vue";
const props = defineProps<{
  type: string;
}>();

const alertText = ref<string>("");

switch (props.type) {
  case "buy":
    alertText.value =
      "Tudo certo! Os tokens já foram retirados da oferta e estão disponíveis na sua carteira.";
    break;
  case "sell":
    alertText.value =
      "Tudo certo! Os tokens já foram reservados e sua oferta está disponível.";
    break;
}
</script>
<template>
  <div
    class="modal-overlay inset-0 absolute backdrop-blur-sm sm:backdrop-blur-none"
  >
    <div class="modal px-12 pl-72 text-center flex justify-between">
      <p class="text-black tracking-tighter leading-tight my-2">
        {{ alertText }}
      </p>
      <img
        src="../../assets/closeAlertIcon.svg"
        alt="close alert"
        class="w-3 cursor-pointer"
        @click="$emit('close-alert')"
      />
    </div>
  </div>
</template>
<style scoped>
.modal-overlay {
  display: flex !important;
  height: 100%;
  width: 100%;
}

.modal {
  background-color: rgba(251, 191, 36, 1);
  height: 8%;
  width: 100%;
  border-radius: 10px;
  align-items: center;
  white-space: nowrap;
}
.close {
  cursor: pointer;
}

.close-img {
  width: 25px;
}

.check {
  width: 150px;
}

h6 {
  font-weight: 500;
  font-size: 28px;
  margin: 20px 0;
}

p {
  font-size: 20px;
}

button {
  width: 100px;
  height: 40px;
  color: black;
  font-size: 14px;
  border-radius: 10px;
}
</style>
