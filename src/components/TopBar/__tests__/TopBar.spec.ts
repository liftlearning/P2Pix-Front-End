/* eslint-disable no-undef */
import { shallowMount } from "@vue/test-utils";
import TopBar from "../TopBar.vue";

describe("TopBar.vue", () => {
  it("render component when called", () => {
    const wrapper = shallowMount(TopBar);
    expect(wrapper).toBeCalled();
  });
});
