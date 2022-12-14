<script setup lang="ts">
import { ref } from "vue";
import CustomButton from "../CustomButton.vue";
import { debounce } from "@/utils/debounce";

// Reactive state
const offer = ref<string | number>("");
const pixKey = ref<string>("");

const enableSelectButton = ref(false);
const hasLiquidity = ref(true);
const validDecimals = ref(true);

// Emits
const emit = defineEmits(["approveTokens"]);

// Debounce methods
const handleInputEvent = (event: any) => {
  const { value } = event.target;

  offer.value = Number(value);

  if (decimalCount(offer.value) > 2) {
    validDecimals.value = false;
    enableSelectButton.value = false;
    return;
  }
  validDecimals.value = true;
};

// Enable button methods
// Check if has more than 2 decimal places
const decimalCount = (num: Number) => {
  const numStr = String(num);
  if (numStr.includes(".")) {
    return numStr.split(".")[1].length;
  }
  return 0;
};
</script>

<template>
  <div class="page">
    <div class="text-container">
      <span class="text font-extrabold text-5xl max-w-[29rem]"
        >Venda cripto e receba em Pix</span
      >
      <span class="text font-medium text-base max-w-[28rem]"
        >Digite sua oferta, informe a chave Pix, selecione a rede, aprove o
        envio da transação e confirme sua oferta.</span
      >
    </div>
    <div class="blur-container">
      <div
        class="flex flex-col w-full bg-white px-10 py-5 rounded-lg border-y-10"
      >
        <div class="flex justify-between w-full items-center">
          <input
            type="number"
            v-model="offer"
            class="border-none outline-none text-lg text-gray-900 w-fit"
            v-bind:class="{
              'font-semibold': offer != undefined,
              'text-xl': offer != undefined,
            }"
            @input="debounce(handleInputEvent, 500)($event)"
            placeholder="Digite sua oferta"
            step=".01"
          />
          <div
            class="flex flex-row p-2 px-3 bg-gray-300 rounded-3xl min-w-fit gap-1"
          >
            <img alt="Token image" class="w-fit" src="@/assets/brz.svg" />
            <span class="text-gray-900 text-lg w-fit" id="brz">BRZ</span>
          </div>
        </div>

        <div class="flex pt-2 justify-center" v-if="!validDecimals">
          <span class="text-red-500 font-normal text-sm"
            >Por favor utilize no máximo 2 casas decimais</span
          >
        </div>
        <div class="flex pt-2 justify-center" v-else-if="!hasLiquidity">
          <span class="text-red-500 font-normal text-sm"
            >Atualmente não há liquidez nas redes para sua demanda</span
          >
        </div>
      </div>
      <div
        class="flex flex-col w-full bg-white px-10 py-8 rounded-lg border-y-10"
      >
        <div class="flex justify-between w-full items-center">
          <input
            type="text"
            v-model="pixKey"
            class="border-none outline-none text-lg text-gray-900 w-fit"
            placeholder="Digite a chave Pix"
          />
        </div>
      </div>
      <CustomButton
        :text="'Aprovar tokens'"
        @buttonClicked="emit('approveTokens', { offer, pixKey })"
      />
    </div>
  </div>
</template>

<style scoped>
.custom-divide {
  width: 100%;
  border-bottom: 1px solid #d1d5db;
}
.bottom-position {
  top: -20px;
  right: 50%;
  transform: translateX(50%);
}

.page {
  @apply flex flex-col items-center justify-center w-full mt-16;
}

.text-container {
  @apply flex flex-col items-center justify-center gap-4;
}

.text {
  @apply text-gray-800 text-center;
}

.blur-container {
  @apply flex flex-col justify-center items-center px-8 py-6 gap-2 rounded-lg shadow-md shadow-gray-600 backdrop-blur-md mt-10;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
