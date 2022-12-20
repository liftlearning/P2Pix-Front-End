<script setup lang="ts">
import CustomButton from "@/components/CustomButton.vue";
import blockchain from "../utils/blockchain";

// props
const props = defineProps<{
  lastWalletReleaseTransactions: any[] | undefined;
  tokenAmount: Number | undefined;
}>();

// Emits
const emit = defineEmits(["makeAnotherTransaction"]);

const formatEventsAmount = (amount: any) => {
  try {
    const formated = blockchain.formatBigNumber(amount);
    return formated;
  } catch {
    return "";
  }
};

const openEtherscanUrl = (url: string) => {
  window.open(url, "_blank");
};
</script>

<template>
  <div class="page">
    <div class="text-container">
      <span class="text font-extrabold text-5xl max-w-[50rem]"
        >Os tokens já foram transferidos <br />
        para a sua carteira!
      </span>
    </div>
    <div class="blur-container">
      <div
        class="flex flex-col w-full bg-white px-10 py-5 rounded-lg border-y-10"
      >
        <div>
          <p>Tokens recebidos</p>
          <p class="text-2xl text-gray-900">{{ props.tokenAmount }} BRZ</p>
        </div>
        <div class="my-5">
          <p>
            <b>Não encontrou os tokens? </b>Clique no botão abaixo para <br />
            cadastrar o BRZ em sua carteira.
          </p>
        </div>
        <CustomButton
          :text="'Cadastrar token na carteira'"
          @buttonClicked="() => {}"
        />
      </div>
      <button
        type="button"
        class="border-amber-500 border-2 rounded default-button text-white p-2 px-50 min-w-[198px]"
        @click="emit('makeAnotherTransaction')"
      >
        Fazer nova transação
      </button>
    </div>
    <div class="text-container mt-16">
      <span class="text font-extrabold text-3xl max-w-[50rem]"
        >Últimas transações
      </span>
    </div>
    <div class="blur-container min-w-[80%] gap-8">
      <div class="flex flex-row justify-between w-full px-8">
        <span class="text-xs text-gray-50 font-medium">Valor</span>
        <span class="text-xs text-gray-50 font-medium">Tipo de transação</span>
        <span class="text-xs text-gray-50 font-medium">Checar transação</span>
      </div>
      <div
        class="flex flex-row justify-between w-full bg-white px-6 py-4 rounded-lg"
        v-for="release in lastWalletReleaseTransactions"
        :key="release?.blockNumber"
      >
        <span class="last-release-info">
          {{ formatEventsAmount(release?.args.amount) }} BRZ
        </span>
        <span class="last-release-info">
          {{ "Compra" }}
        </span>
        <div
          class="flex gap-2 cursor-pointer items-center"
          @click="
            openEtherscanUrl(
              `https://etherscan.io/tx/${release?.transactionHash}`
            )
          "
        >
          <span class="last-release-info">Etherscan</span>
          <img alt="Redirect image" src="@/assets/redirect.svg" />
        </div>
      </div>
      <div class="flex justify-center w-full right-6 mt-2">
        <button
          type="button"
          class="text-white"
          @click="() => {}"
          v-if="lastWalletReleaseTransactions?.length != 0"
        >
          Carregar mais
        </button>
      </div>

      <p class="font-bold" v-if="lastWalletReleaseTransactions?.length == 0">
        Não há nenhuma transação anterior
      </p>
    </div>
  </div>
</template>

<style scoped>
.page {
  @apply flex flex-col items-center justify-center w-full mt-16;
}

p {
  @apply text-gray-900;
}

.text-container {
  @apply flex flex-col items-center justify-center gap-4;
}

.text {
  @apply text-gray-800 text-center;
}
.blur-container-row {
  @apply flex flex-row justify-center items-center px-8 py-6 gap-2 rounded-lg shadow-md shadow-gray-600 backdrop-blur-md mt-8 w-1/3;
}

.blur-container {
  @apply flex flex-col justify-center items-center px-8 py-6 gap-4 rounded-lg shadow-md shadow-gray-600 backdrop-blur-md mt-10 w-auto;
}

.last-release-info {
  @apply font-medium text-base text-gray-900;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
