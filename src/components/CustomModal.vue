<script setup lang="ts"></script>

<template>
  <div
    class="modal-overlay inset-0 fixed justify-center backdrop-blur-sm sm:backdrop-blur-none"
  >
    <div class="modal px-5 text-center">
      <p
        class="text-black tracking-tighter leading-tight my-6 mx-2 text-justify"
      >
        <strong>ATENÇÃO!</strong>
        A transação só será processada após inserir o código de autenticação.
        Caso contrário não conseguiremos comprovar o seu depósito e não será
        possível transferir os tokens para sua carteira.
      </p>
      <button
        @click="$emit('close-modal')"
        class="border-2 border-solid border-amber-400 mt-2"
      >
        Entendi
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  display: flex !important;
}

.modal {
  background-color: white;
  height: 250px;
  width: 300px;
  margin-top: 50%;
  border-radius: 10px;
}
.close {
  cursor: pointer;
}

.close-img {
  width: 25px;
}

.check {
  width: 150px;
}

h6 {
  font-weight: 500;
  font-size: 28px;
  margin: 20px 0;
}

p {
  font-size: 16px;
}

button {
  width: 100px;
  height: 40px;
  color: black;
  font-size: 14px;
  border-radius: 10px;
}
</style>
