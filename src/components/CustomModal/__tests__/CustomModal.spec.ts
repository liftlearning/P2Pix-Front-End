import { mount } from "@vue/test-utils";
import CustomModal from "../CustomModal.vue";

describe("CustomModal test", () => {
  test("Test custom modal when receive is redirect modal props as false", () => {
    const wrapper = mount(CustomModal, {
      props: {
        isRedirectModal: false,
      },
    });

    expect(wrapper.html()).toContain("ATENÇÃO!");
    expect(wrapper.html()).toContain("Entendi");
  });

  test("Test custom modal when receive is redirect modal props as true", () => {
    const wrapper = mount(CustomModal, {
      props: {
        isRedirectModal: true,
      },
    });

    expect(wrapper.html()).toContain("Retomar a última compra?");
    expect(wrapper.html()).toContain("Não");
    expect(wrapper.html()).toContain("Sim");
  });
});
