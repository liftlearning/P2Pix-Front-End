<script setup lang="ts">
import { withdrawDeposit } from "@/blockchain/buyerMethods";
import { NetworkEnum } from "@/model/NetworkEnum";
import type { ValidDeposit } from "@/model/ValidDeposit";
import { useEtherStore } from "@/store/ether";
import { formatEther } from "@ethersproject/units";
import type { BigNumber, Event } from "ethers";
import { ref, watch } from "vue";

// props
const props = defineProps<{
  depositList: ValidDeposit[];
  walletTransactions: Event[];
}>();

const emit = defineEmits(["depositWithdrawn"]);

const etherStore = useEtherStore();

const itemsToShow = ref<Event[]>([]);
const withdrawAmount = ref<string>("");

const callWithdraw = async () => {
  if (withdrawAmount.value) {
    const withdraw = await withdrawDeposit(withdrawAmount.value);
    if (withdraw) {
      console.log(withdraw);
      alert("Saque realizado!");
      emit("depositWithdrawn");
    }
  }
};

const getRemaining = (): number => {
  if (props.depositList instanceof Array) {
    // Here we are getting only the first element of the list because
    // in this release only the BRL token is being used.
    const deposit = props.depositList[0]; 
    return deposit ? deposit.remaining : 0;
  }
  return 0;
};

const getExplorer = (): string => {
  return etherStore.networkName == NetworkEnum.ethereum
    ? "Etherscan"
    : "Polygonscan";
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
    LockAdded: "Reserva",
    LockReleased: "Compra",
    DepositWithdrawn: "Retirada",
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

// initial itemsToShow valueb
showInitialItems();
</script>

<template>
  <div class="blur-container">
    <div class="w-full bg-white p-6 rounded-lg">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-sm leading-5 font-medium text-gray-600">
            Saldo disponível
          </p>
          <p class="text-xl leading-7 font-semibold text-gray-900">
            {{ getRemaining() }} BRZ
          </p>
          <p class="text-xs leading-4 font-medium text-gray-600"></p>
        </div>
      </div>
      <div class="pt-5">
        <div class="py-2">
          <p class="text-sm leading-5 font-medium">Valor do saque</p>
          <input
            type="number"
            name=""
            id=""
            placeholder="0"
            class="text-2xl"
            v-model="withdrawAmount"
          />
        </div>

        <hr class="pb-3" />
        <div class="flex justify-end items-center">
          <div
            class="flex gap-2 cursor-pointer items-center justify-self-center border-2 p-2 border-amber-300 rounded-md"
            @click="callWithdraw"
          >
            <img alt="Withdraw image" src="@/assets/withdraw.svg" />
            <span class="last-release-info">Sacar</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-full bg-white p-6 rounded-lg"
      v-for="item in itemsToShow"
      :key="item.blockNumber"
    >
      <div class="item-container">
        <div>
          <p class="text-sm leading-5 font-medium text-gray-600">
            {{ getEventName(item.event) }}
          </p>
          <p class="text-xl leading-7 font-semibold text-gray-900">
            {{ getAmountFormatted(item.args?.amount) }}
            BRZ
          </p>
          <p class="text-xs leading-4 font-medium text-gray-600"></p>
        </div>
        <div>
          <div class="bg-emerald-300 rounded-lg text-center mb-2 p-1">
            Finalizado
          </div>
          <div
            class="flex gap-2 cursor-pointer items-center justify-self-center"
            @click="openEtherscanUrl(item?.transactionHash)"
          >
            <span class="last-release-info">{{ getExplorer() }}</span>
            <img alt="Redirect image" src="@/assets/redirect.svg" />
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
        transações )
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

.item-container {
  @apply flex justify-between items-center;
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