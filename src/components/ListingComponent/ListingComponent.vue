<script setup lang="ts">
import { NetworkEnum } from "@/model/NetworkEnum";
import type { ValidDeposit } from "@/model/ValidDeposit";
import { useEtherStore } from "@/store/ether";
import { formatEther } from "@ethersproject/units";
import type { BigNumber, Event } from "ethers";
import { ref, watch } from "vue";

// props
const props = defineProps<{
  walletTransactions: (Event | ValidDeposit)[];
  isManageMode: boolean;
}>();

const etherStore = useEtherStore();

const itemsToShow = ref<(Event | ValidDeposit)[]>([]);

// Methods
const isValidDeposit = (
  deposit: Event | ValidDeposit
): deposit is ValidDeposit => {
  return (deposit as ValidDeposit).depositID !== undefined;
};

const showInitialItems = (): void => {
  itemsToShow.value = props.walletTransactions.slice(0, 3);
};

const openEtherscanUrl = (transactionHash: string): void => {
  const networkUrl =
    etherStore.networkName == NetworkEnum.ethereum
      ? "goerli.etherscan.io"
      : "mumbai.polygonscan.com";
  const url = `https://${networkUrl}/tx/${transactionHash}`;
  window.open(url, "_blank");
};

const loadMore = (): void => {
  const itemsShowing = itemsToShow.value.length;
  itemsToShow.value?.push(
    ...props.walletTransactions.slice(itemsShowing, itemsShowing + 3)
  );
};

const getEventName = (event: string | undefined): string => {
  if (!event) return "Desconhecido";

  const possibleEventName: { [key: string]: string } = {
    DepositAdded: "Oferta",
    LockAdded: "Compra",
    LockReleased: "Reserva",
  };

  return possibleEventName[event];
};

const getAmountFormatted = (amount?: BigNumber): string => {
  if (!amount) return "";
  return formatEther(amount);
};

// watch props changes
watch(props, async (): Promise<void> => {
  const itemsToShowQty = itemsToShow.value.length;
  if (itemsToShowQty == 0) showInitialItems();
  else
    itemsToShow.value =
      props.walletTransactions.length > itemsToShowQty
        ? props.walletTransactions.slice(0, itemsToShowQty)
        : props.walletTransactions;
});

//emits
const emit = defineEmits(["cancelDeposit", "withdrawDeposit"]);

// initial itemsToShow valueb
showInitialItems();
</script>

<template>
  <div class="blur-container">
    <div
      class="w-full bg-white p-6 rounded-lg"
      v-for="(item, index) in itemsToShow"
      :key="item.blockNumber"
    >
      <div class="flex justify-between items-center">
        <div>
          <p class="text-sm leading-5 font-medium text-gray-600">
            {{ getEventName((item as Event).event) }}
          </p>
          <p class="text-xl leading-7 font-semibold text-gray-900">
            {{
              isValidDeposit(item)
                ? item.remaining
                : getAmountFormatted(item.args?.amount)
            }}
            BRZ
          </p>
          <p class="text-xs leading-4 font-medium text-gray-600">20/08/2022</p>
        </div>
        <div>
          <div class="bg-emerald-300 rounded-lg text-center mb-2">
            Finalizado
          </div>
          <div
            v-if="!props.isManageMode"
            class="flex gap-2 cursor-pointer items-center justify-self-center"
            @click="openEtherscanUrl((item as Event)?.transactionHash)"
          >
            <span class="last-release-info">Etherscan</span>
            <img alt="Redirect image" src="@/assets/redirect.svg" />
          </div>
        </div>
      </div>
      <div class="pt-5" v-if="props.isManageMode">
        <!-- <div class="py-2">
          <p class="text-sm leading-5 font-medium">Valor do saque</p>
          <p class="text-2xl leading-8 font-medium">0</p>
        </div> -->

        <hr class="pb-3" />
        <div class="flex justify-between items-center">
          <div
            class="flex gap-2 cursor-pointer items-center justify-self-center"
            @click="
              emit('cancelDeposit', (item as ValidDeposit).depositID, index)
            "
          >
            <span class="last-release-info">Cancelar</span>
          </div>

          <div
            class="flex gap-2 cursor-pointer items-center justify-self-center border-2 p-2 border-amber-300 rounded-md"
            @click="
              emit('withdrawDeposit', (item as ValidDeposit).depositID, index)
            "
          >
            <img alt="Withdraw image" src="@/assets/withdraw.svg" />
            <span class="last-release-info">Sacar</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex flex-col justify-center items-center w-full mt-2 gap-2"
      v-if="
        itemsToShow.length != 0 &&
        itemsToShow.length != props.walletTransactions.length
      "
    >
      <button
        type="button"
        class="text-white font-semibold"
        @click="loadMore()"
      >
        Carregar mais
      </button>
      <span class="text-gray-300">
        ({{ itemsToShow.length }} de {{ props.walletTransactions.length }}
        {{ isManageMode ? "ofertas" : "transações" }})
      </span>
    </div>

    <span class="font-bold text-gray-900" v-if="itemsToShow.length == 0">
      Não há nenhuma transação anterior
    </span>
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
  @apply text-white text-center;
}
.blur-container-row {
  @apply flex flex-row justify-center items-center px-8 py-6 gap-2 rounded-lg shadow-md shadow-gray-600 backdrop-blur-md mt-8 w-1/3;
}

.blur-container {
  @apply flex flex-col justify-center items-center px-8 py-6 gap-4 rounded-lg shadow-md shadow-gray-600 backdrop-blur-md w-auto;
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
