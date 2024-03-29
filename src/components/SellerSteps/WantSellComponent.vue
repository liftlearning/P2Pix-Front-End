<script setup lang="ts">
import { ref } from "vue";
import CustomButton from "../CustomButton/CustomButton.vue";
import { debounce } from "@/utils/debounce";
import { decimalCount } from "@/utils/decimalCount";
import { pixFormatValidation, postProcessKey } from "@/utils/pixKeyFormat";
import { useEtherStore } from "@/store/ether";
import { storeToRefs } from "pinia";
import { connectProvider } from "@/blockchain/provider";

// Reactive state
const etherStore = useEtherStore();
const { walletAddress } = storeToRefs(etherStore);

const offer = ref<string>("");
const pixKey = ref<string>("");

const enableSelectButton = ref<boolean>(false);
const hasLiquidity = ref<boolean>(true);
const validDecimals = ref<boolean>(true);
const validPixFormat = ref<boolean>(true);

// Emits
const emit = defineEmits(["approveTokens"]);

// Debounce methods
const handleInputEvent = (event: any): void => {
  const { value } = event.target;

  offer.value = value;

  if (decimalCount(offer.value) > 2) {
    validDecimals.value = false;
    enableSelectButton.value = false;
    return;
  }
  validDecimals.value = true;
};

const handlePixKeyInputEvent = (event: any): void => {
  const { value } = event.target;

  pixKey.value = value;

  if (pixFormatValidation(pixKey.value)) {
    validPixFormat.value = true;
    enableSelectButton.value = true;
    return;
  }

  enableSelectButton.value = false;
  validPixFormat.value = false;
};

const handleButtonClick = async (
  offer: string,
  pixKey: string
): Promise<void> => {
  const postProcessedPixKey = postProcessKey(pixKey);
  if (walletAddress.value)
    emit("approveTokens", { offer, postProcessedPixKey });
  else await connectProvider();
};
</script>

<template>
  <div class="page w-full">
    <div class="text-container">
      <span
        class="text font-extrabold sm:text-5xl text-3xl sm:max-w-[29rem] max-w-[20rem]"
        >Venda cripto e receba em Pix</span
      >
      <span
        class="text font-medium sm:text-base text-xs sm:max-w-[28rem] max-w-[30rem] sm:tracking-normal tracking-wide"
        >Digite sua oferta, informe a chave Pix, selecione a rede, aprove o
        envio da transação e confirme sua oferta.</span
      >
    </div>
    <div class="blur-container">
      <div class="backdrop-blur -z-10 w-full h-full"></div>
      <div
        class="flex flex-col w-full bg-white sm:px-10 px-6 py-5 rounded-lg border-y-10"
      >
        <div class="flex justify-between items-center">
          <input
            type="number"
            v-model="offer"
            class="border-none outline-none text-gray-900 sm:w-fit w-3/4"
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
            <img
              alt="Token image"
              class="sm:w-fit w-4"
              src="@/assets/brz.svg"
            />
            <span class="text-gray-900 w-fit" id="brz"> BRZ </span>
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
        class="flex flex-col w-full bg-white sm:px-10 px-6 py-8 rounded-lg border-y-10"
      >
        <div class="flex justify-between w-full items-center">
          <input
            @input="debounce(handlePixKeyInputEvent, 500)($event)"
            type="text"
            v-model="pixKey"
            class="border-none outline-none sm:text-lg text-sm text-gray-900 w-fit"
            placeholder="Digite a chave Pix"
          />
        </div>
        <div class="flex pt-2 justify-center" v-if="!validPixFormat">
          <span class="text-red-500 font-normal text-sm"
            >Por favor utilize telefone, CPF ou CNPJ</span
          >
        </div>
      </div>
      <CustomButton
        :text="walletAddress ? 'Aprovar tokens' : 'Conectar Carteira'"
        :isDisabled="!validDecimals || !validPixFormat"
        @buttonClicked="handleButtonClick(offer, pixKey)"
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
  @apply text-white text-center;
}

.blur-container {
  @apply flex flex-col justify-center items-center px-8 py-6 gap-2 rounded-lg shadow-md shadow-gray-600 mt-10 w-auto;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

input {
  @apply sm:text-lg text-sm;
}
</style>
