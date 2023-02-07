import { MockValidDeposits } from "@/model/mock/ValidDepositMock";
import { it, expect, vi } from "vitest";
import { verifyNetworkLiquidity } from "../networkLiquidity";

vi.useFakeTimers();

describe("verifyNetworkLiquidity function test", () => {
  it("verifyNetworkLiquidity should return an element from valid deposit list when searching for other deposits", () => {
    const liquidityElement = verifyNetworkLiquidity(
      MockValidDeposits[0].remaining,
      "strangeWalletAddress",
      MockValidDeposits
    );
    expect(liquidityElement).toEqual(MockValidDeposits[0]);
  });

  it("verifyNetworkLiquidity should return undefined when all deposits on valid deposit list match connected wallet addres", () => {
    const liquidityElement = verifyNetworkLiquidity(
      MockValidDeposits[0].remaining,
      MockValidDeposits[0].seller,
      [MockValidDeposits[0]]
    );
    expect(liquidityElement).toEqual(undefined);
  });
});
