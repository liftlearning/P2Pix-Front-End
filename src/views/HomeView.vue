<script setup lang="ts">
import CustomButton from "../components/CustomButton.vue";
const searchClick = () => {
  console.log("oferta selecionada");
};
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
        class="flex justify-between w-full bg-white px-10 py-5 rounded-lg border-y-10 relative"
      >
        <input
          type="number"
          class="border-none outline-none text-lg"
          placeholder="Digite o valor que deseja pagar"
        />
        <p class="text-lg font-bold">R$</p>
      </div>

      <div
        class="flex flex-col w-full bg-white px-10 py-5 rounded-lg border-y-10"
      >
        <div
          class="bg-emerald-400 px-4 py-3 rounded-lg absolute bottom-position"
        >
          <img alt="Ethereum image" src="@/assets/arrow.svg" />
        </div>

        <div class="flex justify-between w-full items-center">
          <p class="text-3xl">0</p>
          <div class="flex flex-row p-2 px-3 bg-gray-300 rounded-full">
            <img alt="Ethereum image" class="mr-3" src="@/assets/brz.svg" />
            <p class="text-gray-900 text-lg">BRZ</p>
          </div>
        </div>

        <div class="custom-divide py-2"></div>
        <p class="text-gray-500 text-lg pt-2">~ ETH 0,00 (+0,121%)</p>
      </div>
      <CustomButton
        :text="'Selecionar Oferta'"
        :is-disabled="true"
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
  @apply flex flex-col items-center justify-center w-full mt-20;
}

.text-container {
  @apply flex flex-col items-center justify-center gap-4;
}

.text {
  @apply text-gray-800 text-center;
}
</style>
