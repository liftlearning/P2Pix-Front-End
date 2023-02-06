import { mount } from "@vue/test-utils";
import LoadingComponent from "../LoadingComponent.vue";

describe("Loading.vue", () => {
  test("Test loading content with received props", () => {
    const wrapper = mount(LoadingComponent, {
      props: {
        title: "MockTitle",
        message: "MockMessage",
      },
    });

    expect(wrapper.html()).toContain("MockTitle");
    expect(wrapper.html()).toContain("MockMessage");
  });

  test("Test default text if props title isnt passed", () => {
    const wrapper = mount(LoadingComponent, {
      props: {
        message: "MockMessage",
      },
    });

    expect(wrapper.html()).toContain("Confirme em sua carteira");
    expect(wrapper.html()).toContain("MockMessage");
  });
});
