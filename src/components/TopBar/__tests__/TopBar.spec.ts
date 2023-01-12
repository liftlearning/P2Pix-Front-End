/* eslint-disable no-undef */
import { shallowMount } from "@vue/test-utils";
import TopBar from "../TopBar.vue";
import { createApp } from "vue";
import App from "../../../App.vue";
import { createPinia } from "pinia";

const app = createApp(App);
app.use(createPinia());

describe("TopBar.vue", () => {
  it("render component when called", () => {
    const wrapper = shallowMount(TopBar);
    // expect(wrapper).toBeCalled();
  });
});
