<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useEtherStore } from "../store/ether";
import blockchain from "../utils/blockchain";

const etherStore = useEtherStore();

const { walletAddress, balance, depositList } = storeToRefs(etherStore);

const splitTokens = () => {
  blockchain.splitTokens();
};

const mockDeposit = () => {
  blockchain.mockDeposit();
};

const countDeposit = () => {
  blockchain.countDeposit();
};

const formatWalletAddress = (): string => {
  const walletAddressLength = walletAddress.value.length;
  const initialText = walletAddress.value.substring(0, 5);
  const finalText = walletAddress.value.substring(
    walletAddressLength - 5,
    walletAddressLength - 1
  );
  return `${initialText} ... ${finalText}`;
};

const formatWalletBalance = (): string => {
  const formattedBalance = blockchain.formatEther(balance.value);
  const fixed = formattedBalance.substring(0, 8);

  return fixed;
};
</script>

<template>
  
    <div class="flex gap-4 items-center">

      <button 
        type="button" 
        class="p-2 rounded text-gray-50"
        @click="countDeposit()"
      >
        Contar depósitos
      </button>

      <button 
        type="button" 
        class="p-2 rounded text-gray-50"
        @click="mockDeposit()"
      >
        Mockar depósitos
      </button>

      <button 
        type="button" 
        class="p-2 rounded text-gray-50"
        @click="splitTokens()"
      >
        Dividir tokens
      </button>

    </div>

    <br>
    <br>
    <br>
    <ul>
      <center>
        <li v-for="deposit in depositList" :key="deposit['blockNumber']">{{deposit['args']['0']}} : MRBZ {{blockchain.formatEther(deposit['args']['amount'])}} </li>
      </center>
    </ul>

</template>

<style scoped>
header {
  @apply flex flex-row justify-between w-full items-center;
}
</style>
