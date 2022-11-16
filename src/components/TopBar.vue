<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useEtherStore } from "../store/ether";
import ethers from "../utils/ethers";

const etherStore = useEtherStore();

const { walletAddress, balance } = storeToRefs(etherStore);

const connectMetaMask = () => {
  ethers.connectProvider();
};

const formatWalletAddress = (): string => {
  const walletAddressLength = walletAddress.value.length;
  const initialText = walletAddress.value.substring(0, 5);
  const finalText = walletAddress.value.substring(
    walletAddressLength - 6,
    walletAddressLength - 1
  );
  return `${initialText} ... ${finalText}`;
};

const formatWalletBalance = (): string => {
  const formattedBalance = ethers.formatEther(balance.value);
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
    />
    <div class="flex gap-4 items-center">
      <button type="button" class="p-2 text-gray-50">Quero vender</button>
      <button
        type="button"
        v-if="!walletAddress"
        class="p-2 border-amber-400 border-2 rounded text-gray-50"
        @click="connectMetaMask()"
      >
        Conectar carteira
      </button>
      <div v-if="walletAddress" class="flex gap-4">
        <span class="text-gray-50">
          {{ formatWalletAddress() }}
        </span>
        <span class="text-gray-50"> ETH: {{ formatWalletBalance() }} </span>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  @apply flex flex-row justify-between w-full items-center;
}

.logo {
  display: block;
}
</style>
