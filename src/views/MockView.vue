<script setup lang="ts">
import type { BigNumber } from "ethers";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useEtherStore } from "../store/ether";
import blockchain from "../utils/blockchain";

const etherStore = useEtherStore();

const { depositList } = storeToRefs(etherStore);

const depositValue = ref<Number>();
const depositPixKey = ref<string>("");

const splitTokens = () => {
  blockchain.splitTokens();
};

const mockDeposit = () => {
  if (!depositValue.value || !depositPixKey.value) return;
  blockchain.mockDeposit(depositValue.value.toString(), depositPixKey.value);
};

const countDeposit = () => {
  blockchain.countDeposit();
};

const mapDeposit = (depositId: BigNumber) => {
  blockchain.mapDeposits(depositId);
};
</script>

<template>
  <div class="page">
    <div class="flex flex-col gap-4 justify-start items-start w-2/3">
      <button type="button" class="default-button" @click="countDeposit()">
        Contar depósitos
      </button>

      <div class="flex gap-4 w-full justify-between">
        <input
          type="number"
          class="default-input"
          placeholder="Quantidade de tokens"
          v-model="depositValue"
        />

        <input
          type="text"
          class="default-input"
          placeholder="Chave pix"
          v-model="depositPixKey"
        />

        <button type="button" class="default-button" @click="mockDeposit()">
          Mockar depósitos
        </button>
      </div>

      <button type="button" class="default-button" @click="splitTokens()">
        Dividir tokens
      </button>
    </div>

    <ul class="flex flex-col justify-center items-center gap-4">
      <li
        class="text-gray-900 font-semibold text-lg cursor-pointer border-2 border-amber-400 p-2 rounded-md bg-amber-200"
        v-for="deposit in depositList"
        :key="deposit['blockNumber']"
        @click="mapDeposit(deposit['args']['depositID'])"
      >
        Address:<br />{{ deposit["args"]["0"] }}<br />
        MRBZ: {{ blockchain.formatEther(deposit["args"]["amount"]) }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
header {
  @apply flex flex-row justify-between w-full items-center;
}

.default-button {
  @apply p-2 rounded border-2 border-amber-400 text-gray-50 font-extrabold text-base w-full;
}

.default-input {
  @apply border-none outline-none text-lg text-gray-900 w-64 p-2 rounded-lg;
}

.page {
  @apply flex gap-8 mt-24;
}

@media (max-width: 1024px) {
  .page {
    @apply flex-wrap;
  }
}
</style>
