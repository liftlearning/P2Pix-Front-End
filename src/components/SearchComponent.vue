<script setup lang="ts">
import { ref } from "vue";
import CustomButton from "../components/CustomButton.vue";
import { debounce } from "@/utils/debounce";
import { ethers } from "ethers";
import { useEtherStore } from "@/store/ether";
import { storeToRefs } from "pinia";
import blockchain from "../utils/blockchain";

const TAX_CONVERSION = 1.005
const etherStore = useEtherStore();

const { depositList } = storeToRefs(etherStore);

const searchClick = () => {
  console.log("pass the deposit and token value ammount to next screen")
};

const valueToToken = ref<Number>(0);
const enableSelectButton = ref(false);
const hasLiquidity = ref(true);
const selectedDeposit = ref();

const valueConversion = (event: any) => {
  const { value } = event.target

  valueToToken.value =  Number(value) / TAX_CONVERSION

  enableSelectButton.value = false;
  selectedDeposit.value = null;

  depositList.value.forEach((deposit) => {
    const p2pixTokenValue = blockchain.verifyDepositAmmount(deposit.args.amount);

    if(valueToToken.value!! <= Number(p2pixTokenValue) && valueToToken.value!! != 0){
      enableSelectButton.value = true;
      hasLiquidity.value = true;
      selectedDeposit.value = deposit;
      return;
    }
  })

  if(!enableSelectButton.value){
    hasLiquidity.value = false
  }
}
</script>

<template>
  <div class="page">
    <div class="text-container">
      <span class="text font-extrabold text-5xl max-w-[29rem]"
        >Adquira crypto com apenas um Pix</span
      >
      <span class="text font-medium text-base max-w-[28rem]"
        >Digite um valor, selecione uma oferta, conecta sua carteira e receba a
        crypto após realizar o Pix</span
      >
    </div>
    <div
      class="flex flex-col justify-center items-center px-8 py-6 gap-2 rounded-lg shadow-md shadow-gray-600 backdrop-blur-md w-1/3 mt-10"
    >
      <div
        class="flex justify-between w-full bg-white px-8 py-5 rounded-lg border-y-10 relative gap-2"
      >
        <p class="text-xl font-normal text-gray-900" v-if="valueToToken != undefined && valueToToken != 0">R$</p>
        <input
          type="number"
          class="border-none outline-none text-lg text-gray-900 w-full"
          v-bind:class="{ 'font-semibold': valueToToken != undefined, 'text-xl': valueToToken != undefined}"
          placeholder="Digite o valor que deseja pagar"
          @input="debounce(valueConversion, 500)($event)"
          step=".01"
        />
        <p class="text-xl font-normal text-gray-900" v-if="valueToToken == undefined || valueToToken == 0">R$</p>
      </div>
      <div
        class="flex flex-col w-full bg-white px-10 py-5 rounded-lg border-y-10"
      >
        <div
          class="bg-emerald-400 px-3 py-2.5 rounded-lg absolute bottom-position w-8 h-8"
        >
          <img alt="Ethereum image" src="@/assets/arrow.svg"/>
        </div>

        <div class="flex justify-between w-full items-center">
          <p class="text-3xl text-gray-900">{{valueToToken.toFixed(3)}}</p>
          <div class="flex flex-row p-2 px-3 bg-gray-300 rounded-full">
            <img alt="Ethereum image" class="mr-3" src="@/assets/brz.svg" />
            <p class="text-gray-900 text-lg">BRZ</p>
          </div>
        </div>

        <div class="custom-divide py-2"></div>
        <div class="flex justify-between pt-2" v-if="hasLiquidity">
          <p class="text-gray-500 font-normal text-sm  w-fit">~ ETH 0,00 (+0,121%)</p>
          <div class="flex gap-2">
            <img alt="Polygon image" src="@/assets/polygon.svg" width="24px" height="24px"/>
            <img alt="Ethereum image" src="@/assets/ethereum.svg" width="24px" height="24px"/>
          </div>
        </div>
        <div class="flex pt-2 justify-center" v-if="!hasLiquidity">
          <span class="text-red-500 font-normal text-sm">Atualmente não há liquidez nas redes para sua demanda</span>
        </div>
      </div>
      <CustomButton
        :text="'Selecionar Oferta'"
        :is-disabled="!enableSelectButton"
        @clicked="searchClick()"
      />
    </div>
  </div>
</template>

<style scoped>
.custom-divide {
  width: 100%;
  border-bottom: 1px solid #d1d5db;
}
.bottom-position {
  top: -20px;
  right: 50%;
  transform: translateX(50%);
}

.page {
  @apply flex flex-col items-center justify-center w-full mt-16;
}

.text-container {
  @apply flex flex-col items-center justify-center gap-4;
}

.text {
  @apply text-gray-800 text-center;
}

input[type='number'] {
    -moz-appearance:textfield;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
}
</style>
