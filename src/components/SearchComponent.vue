<script setup lang="ts">
import { ref, watch } from "vue";
import CustomButton from "@/components/CustomButton/CustomButton.vue";
import { debounce } from "@/utils/debounce";
import { useEtherStore } from "@/store/ether";
import { storeToRefs } from "pinia";
import { connectProvider } from "@/blockchain/provider";
import { verifyNetworkLiquidity } from "@/utils/networkLiquidity";
import { NetworkEnum } from "@/model/NetworkEnum";
import type { ValidDeposit } from "@/model/ValidDeposit";
import { decimalCount } from "@/utils/decimalCount";

// Store reference
const etherStore = useEtherStore();

const {
  walletAddress,
  networkName,
  depositsValidListGoerli,
  depositsValidListMumbai,
} = storeToRefs(etherStore);

// Reactive state
const tokenValue = ref<number>(0);
const enableConfirmButton = ref<boolean>(false);
const enableWalletButton = ref<boolean>(false);
const hasLiquidity = ref<boolean>(true);
const validDecimals = ref<boolean>(true);
const selectedGoerliDeposit = ref<ValidDeposit>();
const selectedMumbaiDeposit = ref<ValidDeposit>();

// Emits
const emit = defineEmits(["tokenBuy"]);

// Blockchain methods
const connectAccount = async (): Promise<void> => {
  await connectProvider();

  enableOrDisableConfirmButton();
};

const emitConfirmButton = (): void => {
  const selectedDeposit =
    networkName.value == NetworkEnum.ethereum
      ? selectedGoerliDeposit.value
      : selectedMumbaiDeposit.value;
  emit("tokenBuy", selectedDeposit, tokenValue.value);
};

// Debounce methods
const handleInputEvent = (event: any): void => {
  const { value } = event.target;

  tokenValue.value = Number(value);

  if (decimalCount(String(tokenValue.value)) > 2) {
    validDecimals.value = false;
    enableConfirmButton.value = false;
    return;
  }
  validDecimals.value = true;

  verifyLiquidity();
};

// Verify if there is a valid deposit to buy
const verifyLiquidity = (): void => {
  enableConfirmButton.value = false;
  selectedGoerliDeposit.value = undefined;
  selectedMumbaiDeposit.value = undefined;

  if (tokenValue.value <= 0) {
    enableWalletButton.value = false;
    return;
  }

  selectedGoerliDeposit.value = verifyNetworkLiquidity(
    tokenValue.value,
    walletAddress.value,
    depositsValidListGoerli.value
  );
  selectedMumbaiDeposit.value = verifyNetworkLiquidity(
    tokenValue.value,
    walletAddress.value,
    depositsValidListMumbai.value
  );

  enableOrDisableConfirmButton();
  if (selectedGoerliDeposit.value || selectedMumbaiDeposit.value) {
    hasLiquidity.value = true;
    enableWalletButton.value = true;
  } else {
    hasLiquidity.value = false;
    enableWalletButton.value = true;
  }
};

const enableOrDisableConfirmButton = (): void => {
  if (selectedGoerliDeposit.value && networkName.value == NetworkEnum.ethereum)
    enableConfirmButton.value = true;
  else if (
    selectedMumbaiDeposit.value &&
    networkName.value == NetworkEnum.polygon
  )
    enableConfirmButton.value = true;
  else enableConfirmButton.value = false;
};

watch(networkName, (): void => {
  verifyLiquidity();
  enableOrDisableConfirmButton();
});

watch(walletAddress, (): void => {
  verifyLiquidity();
});
</script>

<template>
  <div class="page">
    <div class="text-container">
      <span class="text font-extrabold text-5xl max-w-[29rem]"
        >Adquira cripto com apenas um Pix</span
      >
      <span class="text font-medium text-base max-w-[28rem]"
        >Digite um valor, confira a oferta, conecte sua carteira e receba os
        tokens após realizar o Pix</span
      >
    </div>
    <div class="blur-container">
      <div
        class="flex flex-col w-full bg-white px-10 py-5 rounded-lg border-y-10"
      >
        <div class="flex justify-between w-full items-center">
          <input
            type="number"
            class="border-none outline-none text-lg text-gray-900 w-fit"
            v-bind:class="{
              'font-semibold': tokenValue != undefined,
              'text-xl': tokenValue != undefined,
            }"
            @input="debounce(handleInputEvent, 500)($event)"
            placeholder="0  "
            step=".01"
          />
          <div
            class="flex flex-row p-2 px-3 bg-gray-300 rounded-3xl min-w-fit gap-1"
          >
            <img alt="Token image" class="w-fit" src="@/assets/brz.svg" />
            <span class="text-gray-900 text-lg w-fit" id="brz">BRZ</span>
          </div>
        </div>

        <div class="custom-divide py-2"></div>
        <div class="flex justify-between pt-2" v-if="hasLiquidity">
          <p class="text-gray-500 font-normal text-sm w-auto">
            ~ R$ {{ tokenValue.toFixed(2) }}
          </p>
          <div class="flex gap-2">
            <img
              alt="Polygon image"
              src="@/assets/polygon.svg"
              width="24"
              height="24"
              v-if="selectedMumbaiDeposit"
            />
            <img
              alt="Ethereum image"
              src="@/assets/ethereum.svg"
              width="24"
              height="24"
              v-if="selectedGoerliDeposit"
            />
          </div>
        </div>
        <div class="flex pt-2 justify-center" v-if="!validDecimals">
          <span class="text-red-500 font-normal text-sm"
            >Por favor utilize no máximo 2 casas decimais</span
          >
        </div>
        <div class="flex pt-2 justify-center" v-else-if="!hasLiquidity">
          <span class="text-red-500 font-normal text-sm"
            >Atualmente não há liquidez nas redes para sua demanda</span
          >
        </div>
      </div>
      <CustomButton
        v-if="!walletAddress"
        :text="'Conectar carteira'"
        :is-disabled="!enableWalletButton"
        @buttonClicked="connectAccount()"
      />
      <CustomButton
        v-if="walletAddress"
        :text="'Confirmar compra'"
        :is-disabled="!enableConfirmButton"
        @buttonClicked="emitConfirmButton()"
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

.blur-container {
  @apply flex flex-col justify-center items-center px-8 py-6 gap-2 rounded-lg shadow-md shadow-gray-600 backdrop-blur-md mt-10;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
