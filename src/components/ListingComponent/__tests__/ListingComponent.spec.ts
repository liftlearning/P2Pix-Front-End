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

  test("Test Headers on List in Manage Mode", () => {
    const wrapper = mount(ListingComponent, {
      props: {
        walletTransactions: MockValidDeposits,
        isManageMode: true,
      },
    });

    expect(wrapper.html()).toContain("Valor");
    expect(wrapper.html()).toContain("Data");
    expect(wrapper.html()).toContain("Cancelar oferta");
    expect(wrapper.html()).toContain("Retirar tokens");
  });

  test("Test Headers on List in Unmanage Mode", () => {
    const wrapper = mount(ListingComponent, {
      props: {
        walletTransactions: MockEvents,
        isManageMode: false,
      },
    });

    expect(wrapper.html()).toContain("Valor");
    expect(wrapper.html()).toContain("Data");
    expect(wrapper.html()).toContain("Tipo de transação");
    expect(wrapper.html()).toContain("Checar transação");
  });

  test("Test number of elements in the list first render", () => {
    const wrapper = mount(ListingComponent, {
      props: {
        walletTransactions: MockEvents,
        isManageMode: false,
      },
    });

    const elements = wrapper.findAll(".transaction-date");

    expect(elements).toHaveLength(3);
  });

  test("Test load more button behavior", async () => {
    const wrapper = mount(ListingComponent, {
      props: {
        walletTransactions: MockValidDeposits,
        isManageMode: false,
      },
    });
    const btn = wrapper.find("button");

    let elements = wrapper.findAll(".transaction-date");
    expect(elements).toHaveLength(3);

    await btn.trigger("click");

    elements = wrapper.findAll(".transaction-date");

    expect(elements).toHaveLength(5);
  });

  test("Test cancel offer button emit", async () => {
    const wrapper = mount(ListingComponent, {
      props: {
        walletTransactions: MockValidDeposits,
        isManageMode: true,
      },
    });
    wrapper.vm.$emit("cancelDeposit");

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("cancelDeposit")).toBeTruthy();
  });

  test("Test withdraw offer button emit", async () => {
    const wrapper = mount(ListingComponent, {
      props: {
        walletTransactions: MockValidDeposits,
        isManageMode: true,
      },
    });
    wrapper.vm.$emit("withdrawDeposit");

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("withdrawDeposit")).toBeTruthy();
  });
});
