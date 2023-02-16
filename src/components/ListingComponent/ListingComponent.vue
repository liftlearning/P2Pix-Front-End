<script setup lang="ts">
import { withdrawDeposit } from "@/blockchain/buyerMethods";
import { NetworkEnum } from "@/model/NetworkEnum";
import type { ValidDeposit } from "@/model/ValidDeposit";
import type { WalletTransaction } from "@/model/WalletTransaction";
import { useEtherStore } from "@/store/ether";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const etherStore = useEtherStore();

// props
const props = defineProps<{
  validDeposits: ValidDeposit[];
  walletTransactions: WalletTransaction[];
}>();

const emit = defineEmits(["depositWithdrawn"]);

const { loadingWalletTransactions } = storeToRefs(etherStore);
const itemsToShow = ref<WalletTransaction[]>([]);
const withdrawAmount = ref<string>("");
const withdrawButtonOpacity = ref<number>(0.6);
const withdrawButtonCursor = ref<string>("not-allowed");
const isCollapsibleOpen = ref<boolean>(false);

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

watch(withdrawAmount, (): void => {
  if (!withdrawAmount.value) {
    withdrawButtonOpacity.value = 0.7;
    withdrawButtonCursor.value = "not-allowed";
  } else {
    withdrawButtonOpacity.value = 1;
    withdrawButtonCursor.value = "pointer";
  }
});

const getRemaining = (): number => {
  if (props.validDeposits instanceof Array) {
    // Here we are getting only the first element of the list because
    // in this release only the BRL token is being used.
    const deposit = props.validDeposits[0];
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
  <div class="blur-container" v-if="loadingWalletTransactions">
    <svg
      aria-hidden="true"
      class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-white"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  </div>
  <div class="blur-container" v-if="!loadingWalletTransactions">
    <div
      class="w-full bg-white p-6 rounded-lg"
      v-if="props.validDeposits.length > 0"
    >
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
        <div v-show="!isCollapsibleOpen" class="flex justify-end items-center">
          <div
            class="flex gap-2 cursor-pointer items-center justify-self-center border-2 p-2 border-amber-300 rounded-md"
            @click="[(isCollapsibleOpen = true)]"
          >
            <img alt="Withdraw image" src="@/assets/withdraw.svg" />
            <span class="last-release-info">Sacar</span>
          </div>
        </div>
        <div v-show="isCollapsibleOpen" class="py-2 w-100">
          <p class="text-sm leading-5 font-medium">Valor do saque</p>
          <input
            type="number"
            name=""
            id=""
            placeholder="0"
            class="text-2xl text-gray-900 w-full outline-none"
            v-model="withdrawAmount"
          />
        </div>
        <hr v-show="isCollapsibleOpen" class="pb-3" />
        <div
          v-show="isCollapsibleOpen"
          class="flex justify-between items-center"
        >
          <h1
            @click="[(isCollapsibleOpen = false)]"
            class="text-black font-medium cursor-pointer"
          >
            Cancelar
          </h1>
          <div
            class="withdraw-button flex gap-2 items-center justify-self-center border-2 p-2 border-amber-300 rounded-md"
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
            {{ item.amount }}
            BRZ
          </p>
          <p class="text-xs leading-4 font-medium text-gray-600"></p>
        </div>
        <div>
          <div
            class="bg-amber-300 rounded-lg text-center mb-2 p-1"
            v-if="getEventName(item.event) == 'Reserva' && item.lockStatus == 1"
          >
            Ativo
          </div>
          <div
            class="bg-[#94A3B8] rounded-lg text-center mb-2 p-1"
            v-if="getEventName(item.event) == 'Reserva' && item.lockStatus == 2"
          >
            Expirado
          </div>
          <div
            class="bg-emerald-300 rounded-lg text-center mb-2 p-1"
            v-if="
              (getEventName(item.event) == 'Reserva' && item.lockStatus == 3) ||
              getEventName(item.event) != 'Reserva'
            "
          >
            Finalizado
          </div>
          <div
            class="flex gap-2 cursor-pointer items-center justify-self-center"
            @click="openEtherscanUrl(item.transactionHash)"
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

.withdraw-button {
  opacity: v-bind(withdrawButtonOpacity);
  cursor: v-bind(withdrawButtonCursor);
}

input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
