import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MockView from "../views/MockView.vue";
import BidHistoryView from "../views/BidHistoryView.vue";
import ManageBidsView from "../views/ManageBidsView.vue";

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
      path: "/bid_history",
      name: "bid history",
      component: BidHistoryView,
    },
    {
      path: "/manage_bids",
      name: "manage bids",
      component: ManageBidsView,
    },
  ],
});

export default router;
