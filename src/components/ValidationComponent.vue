<script setup lang="ts">

</script>
<template>
  <div class="page">
    <div class="text-container">
      <span class="text font-bold text-3xl max-w-[29rem]"
        >Confirme em sua carteira</span
      >
    </div>
    <div class="blur-container w-[26rem]">
      <div
        class="flex flex-col w-full bg-white px-10 py-5 rounded-lg border-y-10"
      >
        <div
          class="flex flex-col text-center justify-center w-full items-center p-2 px-3 rounded-3xl min-w-fit gap-1"
        >
          <img
            alt="Polygon image"
            src="@/assets/validating.svg"
            width="96"
            height="48"
          />
          <span class="text-black font-medium text-sm px-12 mt-4">
            A transação está sendo enviada para a rede
          </span>
        </div>
      </div>
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
