<script setup lang="ts">
import CustomButton from "@/components/CustomButton/CustomButton.vue";
import ListingComponent from "@/components/ListingComponent/ListingComponent.vue";
import type { Event } from "ethers";

// props
const props = defineProps<{
  lastWalletReleaseTransactions: Event[];
  tokenAmount: number | undefined;
}>();

// Emits
const emit = defineEmits(["makeAnotherTransaction"]);
</script>

<template>
  <div class="page">
    <div class="text-container">
      <span class="text font-extrabold sm:text-5xl text-xl max-w-[50rem]"
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
          <p class="text-sm">
            <b>Não encontrou os tokens? </b><br />Clique no botão abaixo para
            <br />
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
    <div class="text-container mt-16 lg-view">
      <span class="text font-extrabold text-3xl max-w-[50rem]"
        >Gerenciar transações
      </span>
    </div>
    <div class="w-full max-w-4xl lg-view">
      <ListingComponent
        :deposit-list="[]"
        :walletTransactions="lastWalletReleaseTransactions"
        :isManageMode="false"
      >
      </ListingComponent>
    </div>
    <RouterLink
      to="/transaction_history"
      class="mt-8 text-white text-2xl font-bold"
    >
      Gerenciar Transações
    </RouterLink>
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
