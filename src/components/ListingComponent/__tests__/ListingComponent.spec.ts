import { mount } from "@vue/test-utils";
import ListingComponent from "../ListingComponent.vue";

const depositsMocked = [
  {
    depositId: 1,
    event: "DepositAdded",
    args: {
      amount: 100,
    },
  },
  {
    depositId: 2,
    event: "DepositAdded",
    args: {
      amount: 200,
    },
  },
  {
    depositId: 3,
    event: "DepositAdded",
    args: {
      amount: 300,
    },
  },
  {
    depositId: 4,
    event: "DepositAdded",
    args: {
      amount: 400,
    },
  },
  {
    depositId: 5,
    event: "DepositAdded",
    args: {
      amount: 500,
    },
  },
  {
    depositId: 6,
    event: "DepositAdded",
    args: {
      amount: 600,
    },
  },
  {
    depositId: 7,
    event: "DepositAdded",
    args: {
      amount: 700,
    },
  },
];

describe("ListingComponent.vue", () => {
  test("Test Headers on List in Manage Mode", () => {
    const wrapper = mount(ListingComponent, {
      props: {
        walletTransactions: depositsMocked,
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
        walletTransactions: depositsMocked,
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
        walletTransactions: depositsMocked,
        isManageMode: false,
      },
    });

    const elements = wrapper.findAll(".transfer-type");

    expect(elements).toHaveLength(3);
  });

  test("Test load more button behavior", async () => {
    const wrapper = mount(ListingComponent, {
      props: {
        walletTransactions: depositsMocked,
        isManageMode: false,
      },
    });

    const btn = wrapper.find("button");
    await btn.trigger("click");

    let elements = wrapper.findAll(".transfer-type");

    expect(elements).toHaveLength(6);

    await btn.trigger("click");

    elements = wrapper.findAll(".transfer-type");

    expect(elements).toHaveLength(7);
  });

  test("Test cancel offer button", async () => {
    const wrapper = mount(ListingComponent, {
      props: {
        walletTransactions: depositsMocked,
        isManageMode: true,
      },
    });

    const cancelButton = wrapper.find('img[alt="Cancel image"]');
    await cancelButton.trigger("click");

    const elements = wrapper.findAll(".transaction-date");

    expect(elements).toHaveLength(2);
  });
});
