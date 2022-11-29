<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useEtherStore } from "../store/ether";
import blockchain from "../utils/blockchain";

const etherStore = useEtherStore();

const { walletAddress, balance } = storeToRefs(etherStore);

const connectMetaMask = () => {
  blockchain.connectProvider();
};

const formatWalletAddress = (): string => {
  const walletAddressLength = walletAddress.value.length;
  const initialText = walletAddress.value.substring(0, 5);
  const finalText = walletAddress.value.substring(
    walletAddressLength - 5,
    walletAddressLength - 1
  );
  return `${initialText}...${finalText}`;
};

const formatWalletBalance = (): string => {
  const formattedBalance = blockchain.formatEther(balance.value);
  const fixed = formattedBalance.substring(0, 8);

  return fixed;
};
</script>

<template>
  <header>
    <img
      alt="P2Pix logo"
      class="logo"
      src="@/assets/logo.svg"
      width="75"
      height="75"
      @load="connectMetaMask()"
    />
    <div class="flex gap-4 items-center">
      <button type="button" class="default-button">Quero vender</button>
      <button
        type="button"
        v-if="!walletAddress"
        class="border-amber-500 border-2 rounded default-button"
        @click="connectMetaMask()"
      >
        Conectar carteira
      </button>
      <div v-if="walletAddress" class="account-info">
        <div class="top-bar-info">
          <img alt="Ethereum image" src="@/assets/ethereum.svg" />
          <span class="default-text"> Ethereum </span>
          <img alt="Chevron Down" src="@/assets/chevronDown.svg" />
        </div>
        <div class="top-bar-info">
          <img alt="Account image" src="@/assets/account.svg" />
          <span class="default-text text-sm">{{ formatWalletAddress() }}</span>
          <img alt="Chevron Down" src="@/assets/chevronDown.svg" />
        </div>
        <div class="top-bar-info">
          <span class="default-text text-sm">
            MBRZ: {{ formatWalletBalance() }}
          </span>
        </div>
        <!-- Temporary div, just to show a wallet's balance -->
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  @apply flex flex-row justify-between w-full items-center;
}

.default-button {
  @apply px-4 py-2 rounded text-gray-50 font-semibold text-base;
}
.account-info {
  @apply flex items-center gap-6;
}

.default-text {
  @apply text-gray-50 font-semibold text-base;
}

.top-bar-info {
  @apply flex justify-between gap-2 px-4 py-2 border-amber-500 border-2 rounded;
}
</style>
