import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import QrCodeFormVue from "../views/QrCodeForm.vue";
import MockView from "../views/MockView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/pix",
      name: "pix",
      component: QrCodeFormVue,
    },
    {
      path: "/mock",
      name: "mock",
      component: MockView,
    },
  ],
});

export default router;
