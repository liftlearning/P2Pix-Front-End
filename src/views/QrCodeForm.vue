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
    merchantName: pixModel.value.name.trim() ? pixModel.value.name : "name",
    merchantCity: pixModel.value.city.trim() ? pixModel.value.city : "city",
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
  <div class="content">
    <h2 class="text-center font-bold text-emerald-50 text-2xl">
        Utilize o QR Code ou copie o código
    </h2>
    <h2 class="text-center font-bold text-emerald-50 text-2xl">
        para realizar o Pix
    </h2>
    <h4 class="text-center">
      Após realizar o Pix no banco de sua preferência, insira o código de
    </h4>
    <h4 class="text-center">
      autenticação para enviar a transação para a rede.
    </h4>
    <div class="white-box-content">
      <div class="black-box-content"></div>
      <span class="text-center">
        Código pix
      </span>
      <span2 class="text-center">
        c02942far7047f6shri5ifh371908973
      </span2>
      <span3 class="text-center">
        <strong>ATENÇÃO!</strong> A transação só será processada após inserir o código de autenticação. Caso contrário não conseguiremos comprovar o seu depósito e não será possível transferir os tokens para sua carteira. Confira aqui como encontrar o código no comprovante.
      </span3>
    </div>
    <div class="white-box-content2">
      <input type="text" placeholder="Digite o código do comprovante PIX">
    </div>
    <button type="button">Enviar para a rede</button>
  </div>
</template>

<style scoped>
.page {
  @apply mt-8 w-full flex justify-center self-center;
}

.form-container {
  background-color: var(--color-background-indigo);
  @apply rounded-md w-full p-2 w-1/2;
}

.col-div {
  @apply flex flex-col;
}

span {
  font-size: 14px;
  font-weight: bold;
  margin-top: 0.3cm;
}

span3 {
  font-size: 11px;
  margin-top: 0.6cm;
  text-align: justify;
  text-align-last: justify;
}
.content {
  margin-top: 2cm;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.black-box-content {
  background-color: #0e0d0d;
  width: 200px;
  height: 200px;
}

.white-box-content {
  background-color: #f9f8f8;
  width: 400px;
  height: 410px;
  margin-top: 1cm;
  border-radius: 8px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 1cm;
}

.white-box-content2 {
  background-color: #f9f8f8;
  width: 400px;
  height: 60px;
  margin-top: 0.2cm;
  border-radius: 8px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0.4cm;
}

button {
  background-color: #FBBF24;
  width: 400px;
  height: 60px;
  margin-top: 0.2cm;
  border-radius: 8px;
}

input {
  background-color: #f9f8f8;
  padding:3px;
  width: 350px;
  align-items: center;
  margin-bottom: 3cm;
}

::placeholder { /* Most modern browsers support this now. */
   color:    #9CA3AF;
}

h4 {
  color: #080808;
  font-size: 14px;
}

h2 {
  color: #080808
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
