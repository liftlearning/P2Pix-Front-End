<script setup lang="ts">
import { pix } from "../utils/QrCodePix";
import { ref } from "vue";
import { debounce } from "@/utils/debounce";
import CustomButton from "./CustomButton.vue";
import axios from "axios";

const props = defineProps({
  pixTarget: String,
  tokenValue: Number,
});

console.log(props.tokenValue);

const qrCode = ref<string>("");
const qrCodePayload = ref<string>("");
const pixQrCode = pix({
  pixKey: props.pixTarget ?? "",
  value: props.tokenValue,
});
const pixIsValid = ref<number>(0);
const stateButton = ref(false);

pixQrCode.base64QrCode().then((code: string) => {
  qrCode.value = code;
});

qrCodePayload.value = pixQrCode.payload();

const handleInputEvent = (event: any) => {
  const { value } = event.target;

  validatePix(value);
};

const validatePix = async (value: any) => {
  var sellerPixKey = props.pixTarget;
  var transactionValue = props.tokenValue;

  var body_req = {
    e2e_id: value,
    pix_key: sellerPixKey,
    pix_value: transactionValue,
  };

  var resp = await axios.post("http://localhost:8000/validate_pix", body_req);
  console.log("🚀 ~ file: QrCodeForm.vue:47 ~ validatePix ~ resp", resp);

  if (value == "123456") {
    pixIsValid.value = 1;
    stateButton.value = true;
  } else if (value == "") {
    pixIsValid.value = 0;
  } else {
    pixIsValid.value = 2;
  }
};
</script>

<template>
  <div class="page">
    <div class="text-container">
      <!-- <h2 class="text-center font-bold text-emerald-50 text-2xl"></h2> -->
      <span class="text font-extrabold text-2xl max-w-[30rem]">
        Utilize o QR Code ou copie o código para realizar o Pix
      </span>
      <!-- <h4 class="text-center"> -->
      <span class="text font-medium text-md max-w-[28rem]">
        Após realizar o Pix no banco de sua preferência, insira o código de
        autenticação para enviar a transação para a rede.
      </span>
    </div>
    <div class="blur-container max-w-[28rem] text-black">
      <div
        class="flex-col items-center justify-center flex w-full bg-white p-8 rounded-lg"
      >
        <img :src="qrCode" class="w-48 h-48" />
        <span class="text-center font-bold">Código pix</span>
        <span class="text-center text-xs">
          {{ pixTarget }}
        </span>
        <img
          alt="Copy PIX code"
          src="@/assets/copyPix.svg"
          width="16"
          height="16"
          class="pt-2 mb-5 cursor-pointer"
        />
        <span class="text-center text-xs text-start">
          <strong>ATENÇÃO!</strong> A transação só será processada após inserir
          o código de autenticação. Caso contrário não conseguiremos comprovar o
          seu depósito e não será possível transferir os tokens para sua
          carteira. Confira aqui como encontrar o código no comprovante.
        </span>
      </div>
      <div
        class="flex-col items-center justify-center flex w-full bg-white p-5 rounded-lg px-5"
      >
        <input
          type="text"
          placeholder="Digite o código do comprovante PIX"
          @input="debounce(handleInputEvent, 500)($event)"
          class="text-md box-border w-full box-border p-2 h-6 mb-2"
        />
        <div class="flex flex-col w-full" v-if="pixIsValid == 2">
          <div class="custom-divide"></div>
          <div class="flex items-center h-8">
            <img
              alt="Invalid Icon"
              src="@/assets/invalidIcon.svg"
              width="14"
              class="cursor-pointer align-middle inline-block"
            />
            <span class="px-1 text-red-500 font-normal text-xs"
              >Código inválido. Por favor, confira e tente novamente.</span
            >
          </div>
        </div>
        <div class="flex flex-col w-full" v-else-if="pixIsValid == 1">
          <div class="custom-divide"></div>
          <div class="flex items-center h-8">
            <img
              alt="Valid Icon"
              src="@/assets/validIcon.svg"
              width="14"
              class="cursor-pointer align-middle inline-block"
            />
            <span class="px-1 text-green-500 font-normal text-sm">
              Código válido.
            </span>
          </div>
        </div>
      </div>
      <CustomButton
        :is-disabled="!(pixIsValid == 1)"
        :text="'Enviar para a rede'"
      />
      <CustomButton v-if="pixIsValid == 1" :text="'Enviar para a rede'" />
    </div>
  </div>
</template>

<style scoped>
.page {
  @apply flex flex-col items-center justify-center w-full mt-16;
}

::placeholder {
  /* Most modern browsers support this now. */
  color: #9ca3af;
}

h4 {
  color: #080808;
  font-size: 14px;
}

h2 {
  color: #080808;
}

.form-input {
  @apply rounded-lg border border-gray-200 p-2 text-black;
}

.form-label {
  @apply font-semibold tracking-wide text-emerald-50;
}

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
  @apply flex flex-col justify-center items-center px-8 py-6 gap-2 rounded-lg shadow-md shadow-gray-600 backdrop-blur-md mt-6;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
