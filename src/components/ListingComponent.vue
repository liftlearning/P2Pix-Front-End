<script setup lang="ts">
import blockchain from "@/utils/blockchain";
import { ref, watch } from "vue";

// props
const props = defineProps<{
  walletTransactions: any[];
  isManageMode: boolean;
}>();

const itemsToShow = ref<any[]>([]);

// Methods
const showInitialItems = () => {
  itemsToShow.value = props.walletTransactions.slice(0, 3);
};

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
  const itemsShowing = itemsToShow.value.length;
  itemsToShow.value?.push(
    ...props.walletTransactions.slice(itemsShowing, itemsShowing + 3)
  );
};

// watch props changes
watch(props, async () => {
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

// initial itemsToShow value
showInitialItems();
</script>

<template>
  <div class="blur-container">
    <div
      class="grid grid-cols-4 grid-flow-row w-full px-6"
      v-if="itemsToShow.length != 0"
    >
      <span class="text-xs text-gray-50 font-medium justify-self-center"
        >Valor</span
      >
      <span class="text-xs text-gray-50 font-medium justify-self-center"
        >Data</span
      >
      <span class="text-xs text-gray-50 font-medium justify-self-center">{{
        props.isManageMode ? "Cancelar oferta" : "Tipo de transação"
      }}</span>
      <span class="text-xs text-gray-50 font-medium justify-self-center">{{
        props.isManageMode ? "Retirar tokens" : "Checar transação"
      }}</span>
    </div>
    <div
      class="grid grid-cols-4 grid-flow-row w-full bg-white px-6 py-4 rounded-lg"
      v-for="(item, index) in itemsToShow"
      :key="item.depositID"
    >
      <span class="last-release-info">
        {{
          item?.args ? formatEventsAmount(item?.args.amount) : item?.remaining
        }}
        BRZ
      </span>

      <!-- TODO: change this hardcoded date -->
      <span class="last-release-info"> 20 out 2022 </span>

      <div
        v-if="props.isManageMode"
        class="flex gap-2 cursor-pointer items-center justify-self-center"
        @click="emit('cancelDeposit', item.depositID, index)"
      >
        <span class="last-release-info">Cancelar</span>
        <img alt="Cancel image" src="@/assets/cancel.svg" />
      </div>

      <span
        class="last-release-info"
        v-if="item.event == 'DepositAdded' && !props.isManageMode"
      >
        {{ "Oferta" }}
      </span>

      <span
        class="last-release-info"
        v-if="item.event == 'LockAdded' && !props.isManageMode"
      >
        {{ "Reserva" }}
      </span>

      <span
        class="last-release-info"
        v-if="item.event == 'LockReleased' && !props.isManageMode"
      >
        {{ "Compra" }}
      </span>

      <div
        v-if="props.isManageMode"
        class="flex gap-2 cursor-pointer items-center justify-self-center"
        @click="emit('withdrawDeposit', item.depositID, index)"
      >
        <span class="last-release-info">Retirar</span>
        <img alt="Cancel image" src="@/assets/withdraw.svg" />
      </div>

      <div
        v-if="!props.isManageMode"
        class="flex gap-2 cursor-pointer items-center justify-self-center"
        @click="
          openEtherscanUrl(`https://etherscan.io/tx/${item?.transactionHash}`)
        "
      >
        <span class="last-release-info">Etherscan</span>
        <img alt="Redirect image" src="@/assets/redirect.svg" />
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
  @apply text-gray-800 text-center;
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
