<script setup lang="ts">
import { ref } from "vue";
const props = defineProps<{
  type: string;
}>();

const alertText = ref<string>("");
const alertPaddingLeft = ref<string>("18rem");
const alertPaddingTop = ref<string>("0rem");

if (props.type === "sell") {
  alertPaddingLeft.value = "30%";
} else if (props.type === "buy") {
  alertPaddingLeft.value = "30%";
} else if (props.type === "redirect") {
  alertPaddingLeft.value = "35%";
  alertPaddingTop.value = "8rem";
}

switch (props.type) {
  case "buy":
    alertText.value =
      "Tudo certo! Os tokens já foram retirados da oferta e estão disponíveis na sua carteira.";
    break;
  case "sell":
    alertText.value =
      "Tudo certo! Os tokens já foram reservados e sua oferta está disponível.";
    break;
  case "redirect":
    alertText.value = "Existe uma compra em aberto. Continuar?";
    break;
}
</script>
<template>
  <div
    class="modal-overlay inset-0 absolute backdrop-blur-sm sm:backdrop-blur-none"
  >
    <div class="modal px-12 pl-72 text-center flex justify-between">
      <div class="flex items-center">
        <p class="text-black tracking-tighter leading-tight my-2">
          {{ alertText }}
        </p>
        <button v-if="props.type === 'redirect'" @click="$emit('go-to-lock')">
          Sim
        </button>
      </div>
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
  justify-content: center;
  width: 100%;
  padding-top: 7rem;
  height: 3rem;
  z-index: 10;
}

.modal {
  background-color: rgba(251, 191, 36, 1);
  height: 3rem;
  width: 96%;
  border-radius: 10px;
  align-items: center;
  white-space: nowrap;
  padding-left: v-bind(alertPaddingLeft);
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
  font-weight: 600;
}

button {
  width: 50px;
  height: 30px;
  color: black;
  font-size: 16px;
  border-radius: 10px;
  border: 2px solid white;
  margin-left: 1rem;
}
</style>
