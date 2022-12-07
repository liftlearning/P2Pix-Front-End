import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MockView from "../views/MockView.vue";
import QrCodeFormVue from "../components/QrCodeForm.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/mock",
      name: "mock",
      component: MockView,
    },
    {
      path: "/pix",
      name: "pix",
      component: QrCodeFormVue,
    },
  ],
});

export default router;
