import { mount } from "@vue/test-utils";
import CustomButton from "../CustomButton.vue";

describe("CustomButton.vue", () => {
  test("Test button content", () => {
    const wrapper = mount(CustomButton, {
      props: {
        text: "Testing",
      },
    });

    expect(wrapper.html()).toContain("Testing");
  });

  test("Test if disabled props works", () => {
    const wrapper = mount(CustomButton, {
      props: {
        isDisabled: true,
      },
    });

    //@ts-ignore
    const button = wrapper.find(".button") as HTMLButtonElement;
    //@ts-ignore
    expect(button.element.disabled).toBe(true);
  });
});
