import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MockView from "../views/MockView.vue";
import TransactionHistoryView from "../views/TransactionHistoryView.vue";
import FaqView from "../views/FaqView.vue";
import ManageBidsView from "../views/ManageBidsView.vue";
import SellerView from "@/views/SellerView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/seller",
      name: "seller",
      component: SellerView,
    },
    {
      path: "/mock",
      name: "mock",
      component: MockView,
    },
    {
      path: "/transaction_history",
      name: "transaction history",
      component: TransactionHistoryView,
    },
    {
      path: "/manage_bids",
      name: "manage bids",
      component: ManageBidsView,
    },
    {
      path: "/faq",
      name: "faq",
      component: FaqView,
    },
  ],
});

export default router;
