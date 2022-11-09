<script setup lang="ts">
import ethers from '../ethers'

const connectMetaMask = () => {
  ethers.getProvider().then((web3Provider) => {
    console.log(web3Provider);
  })
}

</script>

<template>
  <div class="about">
    <button class="rounded-lg w-full border border-emerald-900 text-white py-2 bg-emerald-600 hover:bg-emerald-500 mt-4" @click="connectMetaMask()">Conectar metaMask</button>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
</style>
