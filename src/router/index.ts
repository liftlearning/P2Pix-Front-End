import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import QrCodeFormVue from "../views/QrCodeForm.vue";

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
  ],
});

export default router;
