<script setup lang="ts">
import router from "@/router";
import { storeToRefs } from "pinia";
import { useEtherStore } from "../store/ether";
import { ref } from "vue";
import blockchain from "../utils/blockchain";

// Store reference
const etherStore = useEtherStore();

const { walletAddress, balance } = storeToRefs(etherStore);

const menuOpenToggle = ref<boolean>(false);
const menuHoverToggle = ref<boolean>(false);

const currencyMenuOpenToggle = ref<boolean>(false);
const currencyMenuHoverToggle = ref<boolean>(false);

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

const formatWalletBalance = (): String => {
  const fixed = Number(balance.value);
  return fixed.toFixed(2);
};

const disconnectUser = () => {
  etherStore.setWalletAddress("");
  closeMenu();
  window.location.reload();
};

const closeMenu = () => {
  menuOpenToggle.value = false;
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
      <button
        type="button"
        class="default-button"
        v-on:click="router.push('/seller')"
      >
        Quero vender
      </button>
      <button
        type="button"
        v-if="!walletAddress"
        class="border-amber-500 border-2 rounded default-button"
        @click="connectMetaMask()"
      >
        Conectar carteira
      </button>
      <div v-if="walletAddress" class="account-info">
        <div class="flex flex-col">
          <div
            class="group top-bar-info cursor-pointer hover:bg-white"
            @click="
              [
                (currencyMenuOpenToggle = !currencyMenuOpenToggle),
                (menuOpenToggle = false),
              ]
            "
            @mouseover="currencyMenuHoverToggle = true"
            @mouseout="currencyMenuHoverToggle = false"
            :style="{
              backgroundColor: currencyMenuOpenToggle
                ? '#F9F9F9'
                : currencyMenuHoverToggle
                ? '#F9F9F9'
                : 'transparent',
            }"
          >
            <img alt="Ethereum image" src="@/assets/ethereum.svg" />
            <span
              class="default-text group-hover:text-gray-900"
              :style="{
                color: currencyMenuOpenToggle
                  ? '#000000'
                  : currencyMenuHoverToggle
                  ? '#000000'
                  : 'rgb(249 250 251)',
              }"
            >
              Ethereum
            </span>
            <img
              class="text-gray-900"
              v-if="!currencyMenuHoverToggle && !currencyMenuOpenToggle"
              alt="Chevron Down"
              src="@/assets/chevronDown.svg"
            />
            <img
              v-if="currencyMenuOpenToggle"
              alt="Chevron Up"
              src="@/assets/chevronUp.svg"
            />
            <img
              v-if="currencyMenuHoverToggle && !currencyMenuOpenToggle"
              alt="Chevron Down Black"
              src="@/assets/chevronDownBlack.svg"
            />
          </div>
          <div
            v-show="currencyMenuOpenToggle"
            class="mt-10 pl-3 absolute w-full text-gray-900"
          >
            <div class="mt-2">
              <div class="bg-white rounded-md z-10">
                <div class="menu-button gap-2 px-4 rounded-md cursor-pointer">
                  <img
                    alt="Ethereum image"
                    width="20"
                    height="20"
                    src="@/assets/ethereum.svg"
                  />
                  <span
                    class="text-gray-900 py-4 text-end font-semibold text-sm"
                  >
                    Ethereum
                  </span>
                </div>
                <div class="w-full flex justify-center">
                  <hr class="w-4/5" />
                </div>
                <div class="menu-button gap-2 px-4 rounded-md cursor-pointer">
                  <img
                    alt="Polygon image"
                    width="20"
                    height="20"
                    src="@/assets/polygon.svg"
                  />
                  <span
                    class="text-gray-900 py-4 text-end font-semibold text-sm"
                  >
                    Polygon
                  </span>
                  <hr />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col">
          <div
            class="top-bar-info cursor-pointer"
            @click="
              [
                (menuOpenToggle = !menuOpenToggle),
                (currencyMenuOpenToggle = false),
              ]
            "
            @mouseover="menuHoverToggle = true"
            @mouseout="menuHoverToggle = false"
            :style="{
              backgroundColor: menuOpenToggle
                ? '#F9F9F9'
                : menuHoverToggle
                ? '#F9F9F9'
                : 'transparent',
            }"
          >
            <img alt="Account image" src="@/assets/account.svg" />
            <span
              class="default-text text-sm"
              :style="{
                color: menuOpenToggle
                  ? '#000000'
                  : menuHoverToggle
                  ? '#000000'
                  : 'rgb(249 250 251)',
              }"
            >
              {{ formatWalletAddress() }}
            </span>
            <img
              class="text-gray-900"
              v-if="!menuHoverToggle && !menuOpenToggle"
              alt="Chevron Down"
              src="@/assets/chevronDown.svg"
            />
            <img
              v-if="menuOpenToggle"
              alt="Chevron Up"
              src="@/assets/chevronUp.svg"
            />
            <img
              v-if="menuHoverToggle && !menuOpenToggle"
              alt="Chevron Down Black"
              src="@/assets/chevronDownBlack.svg"
            />
          </div>
          <div
            v-show="menuOpenToggle"
            class="mt-10 absolute w-full text-gray-900"
          >
            <div class="pl-4 mt-2">
              <div class="bg-white rounded-md z-10">
                <div class="menu-button" @click="closeMenu()">
                  <RouterLink to="/bid_history" class="redirect_button px-0">
                    Histórico de transações
                  </RouterLink>
                </div>
                <div class="w-full flex justify-center">
                  <hr class="w-4/5" />
                </div>
                <div class="menu-button" @click="closeMenu()">
                  <RouterLink to="/manage_bids" class="redirect_button">
                    Gerenciar Ofertas
                  </RouterLink>
                </div>
                <div class="w-full flex justify-center">
                  <hr class="w-4/5" />
                </div>
                <div class="menu-button" @click="disconnectUser">
                  <RouterLink to="/" class="redirect_button">
                    Desconectar
                  </RouterLink>
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

.redirect_button {
  @apply py-4 text-gray-900 font-semibold text-xs w-full;
}

.menu-button {
  @apply flex text-center justify-center hover:bg-gray-200;
}

a:hover {
  @apply bg-gray-200 rounded;
}
</style>
