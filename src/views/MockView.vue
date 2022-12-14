<script setup lang="ts">
import type { BigNumber } from "ethers";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useEtherStore } from "../store/ether";
import blockchain from "../utils/blockchain";

// Blockchain Data
const etherStore = useEtherStore();
const { depositsValidList } = storeToRefs(etherStore);
const { depositsAddedList } = storeToRefs(etherStore);
const { locksAddedList } = storeToRefs(etherStore);

// Buyer's flow Data
const depositValue = ref<Number>();
const depositPixKey = ref<string>("");

//  Split tokens between wallets in wallets.json
const splitTokens = async () => {
  blockchain.splitTokens();
};

// Formatting methods
// Formats wallet address in 0x000...0000 format
const formatWalletAddress = (wallet: string): string => {
  const walletAddressLength = wallet.length;
  const initialText = wallet.substring(0, 5);
  const finalText = wallet.substring(
    walletAddressLength - 4,
    walletAddressLength
  );
  return `${initialText}...${finalText}`;
};

// Deposit methods
// Gets value and pix key from user's form to create a deposit in the blockchain
const mockDeposit = () => {
  if (!depositValue.value || !depositPixKey.value) return;
  blockchain.mockDeposit(depositValue.value, depositPixKey.value);
};

// Get specific deposit data by its ID
const mapDeposit = (depositId: BigNumber) => {
  const deposit = blockchain.mapDeposits(depositId);
  return deposit;
};

// Lock methods
// Get specific lock data by its ID
const mapLock = (lockId: string) => {
  const lock = blockchain.mapLocks(lockId);
  return lock;
};
</script>

<template>
  <div class="page">
    <div class="flex flex-col gap-4 justify-start items-start w-2/3">
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
          Mockar dep??sitos
        </button>
      </div>

      <button type="button" class="default-button" @click="splitTokens()">
        Dividir tokens
      </button>
    </div>

    <ul class="flex flex-col justify-center items-center gap-4">
      <li
        class="text-gray-900 font-semibold text-lg cursor-pointer border-2 border-amber-400 p-2 rounded-md bg-amber-200"
        v-for="deposit in depositsAddedList"
        :key="deposit.blockNumber"
        @click="mapDeposit(deposit.args.depositID)"
      >
        Seller:<br />{{ formatWalletAddress(deposit.args.seller) }}<br />
        MRBZ: {{ blockchain.formatBigNumber(deposit.args.amount) }}
      </li>
    </ul>
    <ul class="flex flex-col justify-center items-center gap-4">
      <li
        class="text-gray-900 font-semibold text-lg cursor-pointer border-2 border-amber-400 p-2 rounded-md bg-amber-200"
        v-for="lock in locksAddedList"
        :key="lock.blockNumber"
        @click="mapLock(lock.args.lockID)"
      >
        Buyer:<br />{{ formatWalletAddress(lock.args.buyer) }}<br />
        MRBZ: {{ blockchain.formatBigNumber(lock.args.amount) }}
      </li>
    </ul>
    <ul class="flex flex-col justify-center items-center gap-4">
      <li
        class="text-gray-900 font-semibold text-lg cursor-pointer border-2 border-amber-400 p-2 rounded-md bg-amber-200"
        v-for="valid in depositsValidList"
        :key="valid.depositID"
        @click="mapDeposit(valid.depositID)"
      >
        Buyer:<br />{{ formatWalletAddress(valid.seller) }}<br />
        MRBZ: {{ valid.remaining }}
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
