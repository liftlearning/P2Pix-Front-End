/* eslint-disable no-undef */
import { shallowMount } from "@vue/test-utils";
import TopBar from "../TopBar.vue";
import { useEtherStore } from "../../../store/ether";

import { createPinia, setActivePinia } from "pinia";

describe("TopBar.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should render connect wallet button", () => {
    const wrapper = shallowMount(TopBar);
    expect(wrapper.html()).toContain("Conectar carteira");
  });

  it("should render button to change to seller view when in buyer screen", () => {
    const wrapper = shallowMount(TopBar);
    expect(wrapper.html()).toContain("Quero vender");
  });

  it("should render button to change to seller view when in buyer screen", () => {
    const etherStore = useEtherStore();
    etherStore.setSellerView(true);
    const wrapper = shallowMount(TopBar);
    expect(wrapper.html()).toContain("Quero comprar");
  });

  it("should render the P2Pix logo correctly", () => {
    const wrapper = shallowMount(TopBar);
    const img = wrapper.findAll(".logo");
    expect(img.length).toBe(2);
  });
});
