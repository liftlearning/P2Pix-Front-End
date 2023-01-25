import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import TransactionHistoryView from "../views/TransactionHistoryView.vue";
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
      path: "/transaction_history",
      name: "transaction history",
      component: TransactionHistoryView,
    },
    {
      path: "/manage_bids",
      name: "manage bids",
      component: ManageBidsView,
    },
  ],
});

export default router;
