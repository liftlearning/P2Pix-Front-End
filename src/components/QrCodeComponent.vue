<script setup lang="ts">
import { pix } from "@/utils/QrCodePix";
import { onMounted, onUnmounted, ref } from "vue";
import { debounce } from "@/utils/debounce";
import CustomButton from "@/components/CustomButton/CustomButton.vue";
import CustomModal from "@/components//CustomModal/CustomModal.vue";
import api from "@/services/index";

// props and store references
const props = defineProps({
  pixTarget: String,
  tokenValue: Number,
});

const windowSize = ref<number>(window.innerWidth);
const qrCode = ref<string>("");
const qrCodePayload = ref<string>("");
const isPixValid = ref<boolean>(false);
const isCodeInputEmpty = ref<boolean>(true);
const showWarnModal = ref<boolean>(true);
const e2eId = ref<string>("");

// Emits
const emit = defineEmits(["pixValidated"]);

const pixQrCode = pix({
  pixKey: props.pixTarget ?? "",
  value: props.tokenValue,
});

pixQrCode.base64QrCode().then((code: string) => {
  qrCode.value = code;
});

qrCodePayload.value = pixQrCode.payload();

const handleInputEvent = async (event: any): Promise<void> => {
  const { value } = event.target;
  e2eId.value = value;
  await validatePix();
};

const validatePix = async (): Promise<void> => {
  if (e2eId.value == "") {
    isPixValid.value = false;
    isCodeInputEmpty.value = true;
    return;
  }
  const sellerPixKey = props.pixTarget;
  const transactionValue = props.tokenValue;

  if (sellerPixKey && transactionValue) {
    const body_req = {
      e2e_id: e2eId.value,
      pix_key: sellerPixKey,
      pix_value: transactionValue,
    };

    isCodeInputEmpty.value = false;

    try {
      await api.post("validate_pix", body_req);
      isPixValid.value = true;
    } catch (error) {
      isPixValid.value = false;
    }
  } else {
    isCodeInputEmpty.value = false;
    isPixValid.value = false;
  }
};

onMounted(() => {
  window.addEventListener(
    "resize",
    () => (windowSize.value = window.innerWidth)
  );
});
onUnmounted(() => {
  window.removeEventListener(
    "resize",
    () => (windowSize.value = window.innerWidth)
  );
});
</script>

<template>
  <div class="page">
    <div class="text-container">
      <span
        class="text font-extrabold lg:text-2xl text-xl sm:max-w-[30rem] max-w-[24rem]"
      >
        Utilize o QR Code ou copie o código para realizar o Pix
      </span>
      <span class="text font-medium lg:text-md text-sm max-w-[28rem]">
        Após realizar o Pix no banco de sua preferência, insira o código de
        autenticação para enviar a transação para a rede.
      </span>
    </div>
    <div class="blur-container sm:max-w-[28rem] max-w-[20rem] text-black">
      <div
        class="flex-col items-center justify-center flex w-full bg-white sm:p-8 p-4 rounded-lg break-normal"
      >
        <img alt="Qr code image" :src="qrCode" class="w-48 h-48" />
        <span class="text-center font-bold">Código pix</span>
        <div class="break-words w-4/5">
          <span class="text-center text-xs">
            {{ qrCodePayload }}
          </span>
        </div>
        <img
          alt="Copy PIX code"
          src="@/assets/copyPix.svg"
          width="16"
          height="16"
          class="pt-2 lg:mb-5 cursor-pointer"
        />
        <span class="text-xs text-start lg-view">
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
          class="sm:text-md text-sm w-full box-border p-2 sm:h-6 h-2 mb-2 outline-none"
        />
        <div class="custom-divide" v-if="!isCodeInputEmpty"></div>
        <div
          class="flex flex-col w-full"
          v-if="!isPixValid && !isCodeInputEmpty"
        >
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
        <div class="flex flex-col w-full" v-else-if="isPixValid == true">
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
        :is-disabled="isPixValid == false"
        :text="'Enviar para a rede'"
        @button-clicked="emit('pixValidated', e2eId)"
      />
    </div>
    <CustomModal
      v-if="showWarnModal && windowSize <= 500"
      @close-modal="showWarnModal = false"
      :isRedirectModal="false"
    />
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

.text-container {
  @apply flex flex-col items-center justify-center gap-4;
}

.text {
  @apply text-white text-center;
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

.lg-view {
  display: inline-block;
}

.sm-view {
  display: none;
}

@media screen and (max-width: 500px) {
  .lg-view {
    display: none;
  }

  .sm-view {
    display: inline-block;
  }
}
</style>
