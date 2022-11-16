<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useEtherStore } from "../store/ether";
import ethers from "../utils/ethers";

const etherStore = useEtherStore();

const { walletAddress } = storeToRefs(etherStore);

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
      <span v-if="walletAddress" class="text-gray-50">
        {{ formatWalletAddress() }}
      </span>
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
