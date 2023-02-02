import { expectTypeOf, it, expect } from "vitest";
import {
  getTokenAddress,
  getP2PixAddress,
  getProviderUrl,
  isPossibleNetwork,
  possibleChains,
  network2Chain,
} from "../addresses";

import { setActivePinia, createPinia } from "pinia";
import { NetworkEnum } from "@/model/NetworkEnum";
import { useEtherStore } from "@/store/ether";

describe("addresses.ts types", () => {
  it("My addresses.ts types work properly", () => {
    expectTypeOf(getTokenAddress).toBeFunction();
    expectTypeOf(getP2PixAddress).toBeFunction();
    expectTypeOf(getProviderUrl).toBeFunction();
    expectTypeOf(isPossibleNetwork).toBeFunction();

    expectTypeOf(possibleChains).toBeObject();
    expectTypeOf(network2Chain).toBeObject();
  });
});

describe("addresses.ts functions", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("getTokenAddress Ethereum", () => {
    const etherStore = useEtherStore();
    etherStore.setNetworkName(NetworkEnum.ethereum);
    expect(getTokenAddress()).toBe(
      "0x4A2886EAEc931e04297ed336Cc55c4eb7C75BA00"
    );
  });

  it("getTokenAddress Polygon", () => {
    const etherStore = useEtherStore();
    etherStore.setNetworkName(NetworkEnum.polygon);
    expect(getTokenAddress()).toBe(
      "0xC86042E9F2977C62Da8c9dDF7F9c40fde4796A29"
    );
  });

  it("getTokenAddress Default", () => {
    expect(getTokenAddress()).toBe(
      "0x4A2886EAEc931e04297ed336Cc55c4eb7C75BA00"
    );
  });

  it("getP2PixAddress Ethereum", () => {
    const etherStore = useEtherStore();
    etherStore.setNetworkName(NetworkEnum.ethereum);
    expect(getP2PixAddress()).toBe(
      "0xefa5cE4351cda51192509cf8De7d8881ADAE95DD"
    );
  });

  it("getP2PixAddress Polygon", () => {
    const etherStore = useEtherStore();
    etherStore.setNetworkName(NetworkEnum.polygon);
    expect(getP2PixAddress()).toBe(
      "0xA9258eBb157E4cf5e756b77FDD0DF09C2F73240b"
    );
  });

  it("getP2PixAddress Default", () => {
    expect(getP2PixAddress()).toBe(
      "0xefa5cE4351cda51192509cf8De7d8881ADAE95DD"
    );
  });

  it("getProviderUrl Ethereum", () => {
    const etherStore = useEtherStore();
    etherStore.setNetworkName(NetworkEnum.ethereum);
    expect(getProviderUrl()).toBe(import.meta.env.VITE_GOERLI_API_URL);
  });

  it("getProviderUrl Polygon", () => {
    const etherStore = useEtherStore();
    etherStore.setNetworkName(NetworkEnum.polygon);
    expect(getProviderUrl()).toBe(import.meta.env.VITE_MUMBAI_API_URL);
  });

  it("getProviderUrl Default", () => {
    expect(getProviderUrl()).toBe(import.meta.env.VITE_GOERLI_API_URL);
  });

  it("isPossibleNetwork Returns", () => {
    const etherStore = useEtherStore();
    etherStore.setNetworkName(NetworkEnum.ethereum);
    expect(isPossibleNetwork("0x5")).toBe(true);
    expect(isPossibleNetwork("5")).toBe(true);
    expect(isPossibleNetwork("0x13881")).toBe(true);
    expect(isPossibleNetwork("80001")).toBe(true);

    expect(isPossibleNetwork("")).toBe(false);
    expect(isPossibleNetwork(" ")).toBe(false);
    expect(isPossibleNetwork("0x55")).toBe(false);
  });
});
