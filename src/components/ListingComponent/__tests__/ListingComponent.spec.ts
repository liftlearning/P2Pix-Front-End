import { mount } from "@vue/test-utils";
import ListingComponent from "@/components/ListingComponent/ListingComponent.vue";
import { createPinia, setActivePinia } from "pinia";
import { expect } from "vitest";
import { MockValidDeposits } from "@/model/mock/ValidDepositMock";
import { MockEvents } from "@/model/mock/EventMock";

describe("ListingComponent.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test("Test Message when an empty array is received", () => {
    const wrapper = mount(ListingComponent, {
      props: {
        depositList: [],
        walletTransactions: [],
        isManageMode: true,
      },
    });

    expect(wrapper.html()).toContain("Não há nenhuma transação anterior");
  });

  test("Test number of elements in the list first render", () => {
    const wrapper = mount(ListingComponent, {
      props: {
        depositList: [],
        walletTransactions: MockEvents,
        isManageMode: false,
      },
    });

    const elements = wrapper.findAll(".item-container");

    expect(elements).toHaveLength(3);
  });

  test("Test load more button behavior", async () => {
    const wrapper = mount(ListingComponent, {
      props: {
        depositList: [],
        walletTransactions: MockValidDeposits,
        isManageMode: false,
      },
    });
    const btn = wrapper.find("button");

    let elements = wrapper.findAll(".item-container");
    expect(elements).toHaveLength(3);

    await btn.trigger("click");

    elements = wrapper.findAll(".item-container");

    expect(elements).toHaveLength(5);
  });

  test("Test withdraw offer button emit", async () => {
    const wrapper = mount(ListingComponent, {
      props: {
        depositList: MockValidDeposits,
        walletTransactions: MockValidDeposits,
        isManageMode: true,
      },
    });
    wrapper.vm.$emit("depositWithdrawn");

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("depositWithdrawn")).toBeTruthy();
  });
});
