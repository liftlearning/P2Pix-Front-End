<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useEtherStore } from "../store/ether";
import { ref } from "vue";
import blockchain from "../utils/blockchain";

// Store reference
const etherStore = useEtherStore();

const { walletAddress, balance } = storeToRefs(etherStore);

const emit = defineEmits(["disconnectUser"]);

const menuToggle = ref<boolean>(false);

//Methods
const connectMetaMask = () => {
  blockchain.connectProvider();
};

const formatWalletAddress = (): string => {
  const walletAddressLength = walletAddress.value.length;
  const initialText = walletAddress.value.substring(0, 5);
  const finalText = walletAddress.value.substring(
    walletAddressLength - 4,
    walletAddressLength
  );
  return `${initialText}...${finalText}`;
};

const formatWalletBalance = (): string => {
  const formattedBalance = blockchain.formatEther(balance.value);
  const fixed = formattedBalance.substring(0, 8);

  return fixed;
};

// const disconnectWallet = () => {
//   menuToggle.value = false;
// };

const log = () => {
  console.log(menuToggle.value);
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
        <div class="flex flex-col">
          <div
            class="top-bar-info"
            @mouseover="menuToggle = true"
            @mouseout="menuToggle = false"
            :style="{
              backgroundColor: menuToggle ? '#F9F9F9' : 'transparent',
            }"
          >
            <img alt="Account image" src="@/assets/account.svg" />
            <span
              class="default-text text-sm"
              :style="{
                color: menuToggle ? '#000000' : 'rgb(249 250 251)',
              }"
            >
              {{ formatWalletAddress() }}
            </span>
            <img alt="Chevron Down" src="@/assets/chevronDown.svg" />
          </div>
          <div
            v-show="menuToggle"
            class="mt-10 absolute w-full text-black"
            @mouseover="menuToggle = true"
            @mouseout="menuToggle = false"
          >
            <div class="pl-4 mt-2">
              <div class="bg-white rounded-md z-10">
                <div
                  class="menu-button px-4 rounded-md cursor-pointer"
                  onclick="window.location='/bid_history'"
                >
                  <div class="py-4 text-end font-semibold text-xs">
                    Histórico de compras
                  </div>
                  <hr />
                </div>
                <div
                  class="menu-button px-4 cursor-pointer"
                  onclick="window.location='/manage_bids'"
                >
                  <div class="py-4 text-end font-semibold text-xs">
                    Gerenciar Ofertas
                  </div>
                  <hr />
                </div>
                <div
                  class="menu-button px-4 py-1 rounded-md cursor-pointer"
                  @click="emit('disconnectUser', {})"
                >
                  <div class="py-3 text-end font-semibold text-xs">
                    Desconectar
                  </div>
                </div>
              </div>
            </div>
          </div>
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

.menu-button:hover {
  background-color: #E5E7EB;
}
</style>
