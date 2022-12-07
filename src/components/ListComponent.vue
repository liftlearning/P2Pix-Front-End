<script setup lang="ts">
import CustomButton from "@/components/CustomButton.vue";
import { useEtherStore } from "@/store/ether";
import { storeToRefs } from "pinia";
import blockchain from "../utils/blockchain";
// Store reference
const etherStore = useEtherStore();

const { walletAddress } = storeToRefs(etherStore);

const lastDeposits = await blockchain.listTransactionByWalletAddress(walletAddress.value.toLowerCase())

const openEtherscanUrl = (url: string) => {
  window.open(url, "_blank")
}

const props = defineProps({
  tokenAmmount: Number,
});

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
          <p class="text-2xl text-gray-900">{{props.tokenAmmount}} BRZ</p>
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
    </div>
    <div class="blur-container-row">
      <button
        type="button"
        class="border-amber-500 border-2 rounded default-button text-white p-2 px-50 w-full"
        @click="() => {}"
      >
        Fazer nova transação
      </button>
      <button
        type="button"
        class="border-amber-500 border-2 rounded default-button text-white p-2"
        @click="() => {}"
      >
        Desconectar
      </button>
    </div>
    <div class="text-container mt-10">
      <span class="text font-extrabold text-3xl max-w-[50rem]"
        >Últimas transações
      </span>
    </div>
    <div class="blur-container">
      <div class="flex flex-row justify-between w-full bg-white p-5 rounded-lg" v-for="deposit in lastDeposits" :key="deposit?.blockNumber">
        <p class="last-deposit-info">{{blockchain.formatBigNumber(deposit?.args.amount)}} BRZ</p>
        <p class="last-deposit-info">{{deposit?.event == 'DepositAdded' ? 'Depósito' : 'Compra'}}</p>
        <div class="flex gap-2 cursor-pointer items-center" @click="openEtherscanUrl(`https://etherscan.io/tx/${deposit?.transactionHash}`)">
          <p class="last-deposit-info">Etherscan</p>
          <img alt="Redirect image" src="@/assets/redirect.svg"/>
        </div>
      </div>
      <button
        type="button"
        class="text-white mt-2"
        @click="() => {}"
        v-if="(lastDeposits?.length != 0)"
      >
        Carregar mais
      </button>
      <p class="font-bold" v-if="(lastDeposits?.length == 0)">Não há nenhuma transação anterior</p>
    </div>
  </div>
</template>

<style scoped>
.page {
  @apply flex flex-col items-center justify-center w-full mt-16;
}

p {
  @apply text-gray-900
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
  @apply flex flex-col justify-center items-center px-8 py-6 gap-2 rounded-lg shadow-md shadow-gray-600 backdrop-blur-md mt-8 w-1/3;
}

.last-deposit-info{
  @apply font-medium text-base
}

input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
