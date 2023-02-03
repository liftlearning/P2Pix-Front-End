<script setup lang="ts">
import type { Faq } from "@/model/Faq";
import { ref } from "vue";
import { marked } from "marked";

const faq = ref<Faq>([
  {
    name: "1. Como Começar",
    items: [
      {
        title: "O que é uma carteira (wallet)",
        content:
          "# Lorem ipsum dolor sit **amet** consectetur. Neque libero magna mi purus. Aliquam vitae feugiat quis sapien. Pharetra gravida nisi donec bibendum mauris aliquam molestie. Et nunc placerat in ac integer maecenas arcu. Lotuam tincidunt morbi ac sed fames habitasse velit et nunc.",
      },
      {
        title: "O que é uma carteira (wallet)",
        content:
          "Lorem ipsum dolor sit amet consectetur. Neque libero magna mi purus. Aliquam vitae feugiat quis sapien. Pharetra gravida nisi donec bibendum mauris aliquam molestie. Et nunc placerat in ac integer maecenas arcu. Lotuam tincidunt morbi ac sed fames habitasse velit et nunc.",
      },
      {
        title: "O que é uma carteira (wallet)",
        content:
          "Lorem ipsum dolor sit amet consectetur. Neque libero magna mi purus. Aliquam vitae feugiat quis sapien. Pharetra gravida nisi donec bibendum mauris aliquam molestie. Et nunc placerat in ac integer maecenas arcu. Lotuam tincidunt morbi ac sed fames habitasse velit et nunc.",
      },
    ],
  },
  {
    name: "2. Comprar tokens",
    items: [
      {
        title: "O que é um endereço de carteira (wallet address)",
        content:
          "Lorem ipsum dolor sit amet consectetur. Neque libero magna mi purus. Aliquam vitae feugiat quis sapien. Pharetra gravida nisi donec bibendum mauris aliquam molestie. Et nunc placerat in ac integer maecenas arcu. Lotuam tincidunt morbi ac sed fames habitasse velit et nunc.",
      },
      {
        title: "O que é um endereço de carteira (wallet address)",
        content:
          "Lorem ipsum dolor sit amet consectetur. Neque libero magna mi purus. Aliquam vitae feugiat quis sapien. Pharetra gravida nisi donec bibendum mauris aliquam molestie. Et nunc placerat in ac integer maecenas arcu. Lotuam tincidunt morbi ac sed fames habitasse velit et nunc.",
      },
      {
        title: "O que é um endereço de carteira (wallet address)",
        content:
          "Lorem ipsum dolor sit amet consectetur. Neque libero magna mi purus. Aliquam vitae feugiat quis sapien. Pharetra gravida nisi donec bibendum mauris aliquam molestie. Et nunc placerat in ac integer maecenas arcu. Lotuam tincidunt morbi ac sed fames habitasse velit et nunc.",
      },
    ],
  },
  {
    name: "3. Vender tokens",
    items: [
      {
        title: "Como conectar a carteira ao p2pix",
        content:
          "Lorem ipsum dolor sit amet consectetur. Neque libero magna mi purus. Aliquam vitae feugiat quis sapien. Pharetra gravida nisi donec bibendum mauris aliquam molestie. Et nunc placerat in ac integer maecenas arcu. Lotuam tincidunt morbi ac sed fames habitasse velit et nunc.",
      },
      {
        title: "Como conectar a carteira ao p2pix",
        content:
          "Lorem ipsum dolor sit amet consectetur. Neque libero magna mi purus. Aliquam vitae feugiat quis sapien. Pharetra gravida nisi donec bibendum mauris aliquam molestie. Et nunc placerat in ac integer maecenas arcu. Lotuam tincidunt morbi ac sed fames habitasse velit et nunc.",
      },
      {
        title: "Como conectar a carteira ao p2pix",
        content:
          "Lorem ipsum dolor sit amet consectetur. Neque libero magna mi purus. Aliquam vitae feugiat quis sapien. Pharetra gravida nisi donec bibendum mauris aliquam molestie. Et nunc placerat in ac integer maecenas arcu. Lotuam tincidunt morbi ac sed fames habitasse velit et nunc.",
      },
    ],
  },
]);

const selectedSection = ref<number>(0);

const setSelectedSection = (index: number) => {
  selectedSection.value = index;
};

const openItem = (index: number) => {
  faq.value[selectedSection.value].items[index].isOpen =
    !faq.value[selectedSection.value].items[index].isOpen;

  faq.value[selectedSection.value].items[index].content = marked(
    faq.value[selectedSection.value].items[index].content
  );
};
</script>

<template>
  <div class="page">
    <div class="text-container">
      <span class="text font-extrabold text-5xl max-w-[50rem]"
        >Perguntas Frequentes
      </span>
      <span class="text text-xl font-medium text-base max-w-[40rem]"
        >Não conseguiu uma resposta para sua dúvida? Acesse a comunidade do
        Discord para falar diretamente conosco.</span
      >
    </div>

    <div class="flex justify-between w-10/12 mt-20">
      <div>
        <h1 class="text-3xl text-white font-bold">Sumário</h1>
        <h3
          :class="index == selectedSection ? 'selected-sumario' : 'sumario'"
          v-for="(f, index) in faq"
          v-bind:key="f.name"
          @click="setSelectedSection(index)"
        >
          {{ f.name }}
        </h3>
      </div>

      <div class="w-4/6">
        <div
          v-for="(item, index) in faq[selectedSection].items"
          v-bind:key="item.title"
        >
          <div class="flex cursor-pointer" @click="openItem(index)">
            <img
              alt="plus"
              src="@/assets/plus.svg"
              class="mr-3"
              v-if="!item.isOpen"
            />
            <img
              alt="plus"
              src="@/assets/minus.svg"
              class="mr-3"
              v-if="item.isOpen"
            />
            <h4 class="text-white">{{ item.title }}</h4>
          </div>
          <div
            style="padding-top: 24px; color: white"
            v-if="item.isOpen"
            v-html="item.content"
          ></div>
          <div class="hr"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sumario {
  margin-top: 24px;
  cursor: pointer;
}

.selected-sumario {
  font-weight: bolder;
  margin-top: 24px;
  cursor: pointer;
}
.page {
  @apply flex flex-col items-center justify-center w-full mt-16;
}

.hr {
  border: 1px solid #1f2937;
  margin: 24px 0;
}

h3 {
  @apply text-white;
}

h2,
h4 {
  font-weight: 600;
}

.text-container {
  @apply flex flex-col items-center justify-center gap-4;
}

.text {
  @apply text-white text-center;
}
.blur-container-row {
  @apply flex flex-row justify-center items-center px-8 py-6 gap-2 rounded-lg shadow-md shadow-gray-600 backdrop-blur-md mt-8 w-1/3;
}

.blur-container {
  @apply flex flex-col justify-center items-center px-8 py-6 gap-2 rounded-lg shadow-md shadow-gray-600 backdrop-blur-md mt-8 w-1/3;
}
</style>
