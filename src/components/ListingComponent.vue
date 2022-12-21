<script setup lang="ts">
import blockchain from '@/utils/blockchain';
import { ref } from 'vue';

const itemsToShow = ref<any[]>([]);

const props = defineProps<{
  lastWalletReleaseTransactions: any[];
}>();

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

const loadMore = () => {
  const itemsShowing = itemsToShow.value.length
  if(props.lastWalletReleaseTransactions?.length > ( itemsShowing + 3))
    itemsToShow.value?.push(...props.lastWalletReleaseTransactions.slice(itemsShowing, itemsShowing + 3))
  else
    itemsToShow.value = props.lastWalletReleaseTransactions
};

itemsToShow.value = (props.lastWalletReleaseTransactions?.length > 3) ? props.lastWalletReleaseTransactions.slice(0, 3) : props.lastWalletReleaseTransactions;

</script>

<template>
      <div class="blur-container">
        <div class="grid grid-cols-4 grid-flow-row w-full px-6">
            <span class="text-xs text-gray-50 font-medium justify-self-center">Valor</span>
            <span class="text-xs text-gray-50 font-medium justify-self-center">Data</span>
            <span class="text-xs text-gray-50 font-medium justify-self-center">Tipo de transação</span>
            <span class="text-xs text-gray-50 font-medium justify-self-center">Checar transação</span>
        </div>
        <div
            class="grid grid-cols-4 grid-flow-row w-full bg-white px-6 py-4 rounded-lg"
            v-for="item in itemsToShow"
            :key="item?.blockNumber"
          >
            <span class="last-release-info">
              {{ formatEventsAmount(item?.args.amount) }} BRZ
            </span>
            
            <span class="last-release-info">
              20 out 2022
            </span>

            <span class="last-release-info">
              {{ "Compra" }}
            </span>

            <div
              class="flex gap-2 cursor-pointer items-center justify-self-center"
              @click="
                openEtherscanUrl(
                  `https://etherscan.io/tx/${item?.transactionHash}`
                )
              "
            >
              <span class="last-release-info">Etherscan</span>
              <img alt="Redirect image" src="@/assets/redirect.svg" />
            </div>
          </div>
          <div class="flex justify-center w-full mt-2">
            <button
              type="button"
              class="text-white"
              @click="loadMore()"
            >
              Carregar mais
            </button>
        </div>
        <p class="font-bold" v-if="props.lastWalletReleaseTransactions?.length == 0">
          Não há nenhuma transação anterior
        </p>
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

.grid-container {
  @apply grid grid-cols-4 grid-flow-row items-center px-8 py-6 gap-4 rounded-lg shadow-md shadow-gray-600 backdrop-blur-md mt-10 w-auto;
}

.last-release-info {
  @apply font-medium text-base text-gray-900 justify-self-center;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>