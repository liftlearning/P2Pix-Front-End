<script setup lang="ts">
import { pix } from "../utils/QrCodePix";
import { ref } from "vue";

const pixModel = ref({
  pixKey: "",
  name: "",
  city: "",
  transactionId: "",
  value: 0,
  message: "",
  qrCodePayload: "",
});

const qrCode = ref<string>("");
const qrCodePayload = ref<string>("");
const toggleModal = ref<boolean>(false);

const errors = ref({
  pixRequiredError: false,
  nameRequiredError: false,
  cityRequiredError: false,
});

const submit = () => {
  errors.value["pixRequiredError"] = pixModel.value["pixKey"] == "";

  if (errors.value["pixRequiredError"]) return;

  const pixQrCode = pix({
    pixKey: pixModel.value.pixKey,
    merchantName: pixModel.value.name.trim()
      ? pixModel.value.name
      : "name",
    merchantCity: pixModel.value.city.trim()
      ? pixModel.value.city
      : "city",
    transactionId: pixModel.value.transactionId.trim()
      ? pixModel.value.transactionId
      : "***",
    message: pixModel.value.message,
    value: pixModel.value["value"],
  });

  pixQrCode.base64QrCode().then((code: string) => {
    qrCode.value = code;
  });

  qrCodePayload.value = pixQrCode.payload();

  toggleModal.value = true;
};
</script>

<template>
  <div class="container">
    <h2 class="text-center font-bold text-emerald-50 text-2xl">
      pixModel QR Code
    </h2>
    <form>
      <div class="grid gap-4 grid-cols-1 p-2">
        <div class="col-div">
          <div class="mb-2">
            <label for="pixKey" class="form-label">Chave PIX</label>
            <span v-if="errors['pixRequiredError']" class="required-error"
              >(Esse campo é obrigatório)</span
            >
          </div>
          <input
            type="text"
            name="pixKey"
            id="pixKey"
            class="form-input"
            v-model="pixModel.pixKey"
          />
        </div>
        <div class="col-div">
          <div class="mb-2">
            <label for="name" class="form-label">Nome do beneficiário</label>
            <span v-if="errors['nameRequiredError']" class="required-error"
              >(Esse campo é obrigatório)</span
            >
          </div>
          <input
            type="text"
            name="name"
            id="name"
            class="form-input"
            v-model="pixModel.name"
          />
        </div>
        <div class="col-div">
          <div class="mb-2">
            <label for="city" class="form-label">Cidade do beneficiário</label>
            <span v-if="errors['cityRequiredError']" class="required-error"
              >(Esse campo é obrigatório)</span
            >
          </div>
          <input
            type="text"
            name="city"
            id="city"
            class="form-input"
            v-model="pixModel.city"
          />
        </div>
        <div class="col-div">
          <label for="value" class="form-label"
            >Valor de transferência (Opcional)</label
          >
          <input
            type="number"
            name="value"
            id="value"
            class="form-input"
            v-model="pixModel.value"
          />
        </div>
        <div class="col-div">
          <label for="code" class="form-label"
            >Código da transferência (Opcional)</label
          >
          <input
            type="text"
            name="code"
            id="code"
            class="form-input"
            v-model="pixModel.transactionId"
          />
        </div>
        <div class="col-div">
          <label for="message" class="form-label">Mensagem (Opcional)</label>
          <input
            type="text"
            name="message"
            id="message"
            class="form-input"
            v-model="pixModel.message"
          />
        </div>
        <button type="button" class="button" @click="submit">
          Gerar QR code
        </button>
      </div>
    </form>

    <div
      v-if="toggleModal"
      class="fixed overflow-x-hidden overflow-y-auto inset-0 flex justify-center items-center z-50"
    >
      <div class="relative mx-auto w-auto max-w-2xl">
        <div
          class="bg-white w-[500px] p-2 rounded shadow-2xl flex flex-col justify-center items-center gap-2"
        >
          <img v-if="qrCode != ''" :src="qrCode" alt="QR code image" />
          <div>
            <span class="text-black font-semibold mr-1">Chave pix:</span>
            <span class="text-gray-700">{{ pixModel.pixKey }}</span>
          </div>
          <div v-if="pixModel.name.trim() != ''">
            <span class="text-black font-semibold mr-1"
              >Nome do Beneficiário:</span
            >
            <span class="text-gray-700">{{ pixModel.name }}</span>
          </div>
          <div v-if="pixModel.value != 0">
            <span class="text-black font-semibold mr-1"
              >Valor da transferência:</span
            >
            <span class="text-gray-700">{{ pixModel.value }}</span>
          </div>
          <div
            class="flex flex-col w-auto break-all justify-center items-center"
          >
            <span class="text-black font-semibold mb-2">Código QR Code:</span>
            <span class="text-gray-700">{{ qrCodePayload }}</span>
          </div>
          <button type="button" class="button" @click="toggleModal = false">
            Fechar
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="toggleModal"
      class="fixed z-40 inset-0 opacity-25 bg-black"
    ></div>
  </div>
</template>

<style scoped>
.container {
  background-color: var(--color-background-indigo);
  @apply rounded-md p-2 mt-8;
}

.col-div {
  @apply flex flex-col;
}

.form-input {
  @apply rounded-lg border border-gray-200 p-2 text-black;
}

.form-label {
  @apply font-semibold tracking-wide text-emerald-50;
}

.button {
  @apply rounded-lg w-full border border-emerald-900 text-white py-2 bg-emerald-600 hover:bg-emerald-500;
}

.required-error {
  @apply ml-2 text-red-500;
}
</style>
