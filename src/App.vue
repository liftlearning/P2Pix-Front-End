<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useEtherStore } from "./store/ether";
import ethers from "./utils/ethers";

const etherStore = useEtherStore();

const { walletAddress } = storeToRefs(etherStore);

const connectMetaMask = () => {
  ethers.getProvider();
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
      <span v-if="walletAddress">
        {{ walletAddress[0] }}
      </span>
    </div>
    <!-- <div class="wrapper">
      <HelloWorld msg="You did it!" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/pix">QrCode Pix</RouterLink>
        <RouterLink to="/ethers">Ethers</RouterLink>
      </nav>
    </div> -->
  </header>
</template>

<style scoped>
header {
  @apply flex flex-row justify-between w-full items-center;
}

.logo {
  display: block;
}

/* nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
