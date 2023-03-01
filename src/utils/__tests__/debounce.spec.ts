import { it, expect, vi, type Mock } from "vitest";
import { debounce } from "../debounce";

vi.useFakeTimers();

describe("debounce function test", () => {
  let mockFunction: Mock;
  let debounceFunction: Function;

  beforeEach(() => {
    mockFunction = vi.fn();
    debounceFunction = debounce(mockFunction, 1000);
  });

  it("debounce function will be executed just once", () => {
    for (let i = 0; i < 100; i++) {
      debounceFunction();
    }

    vi.runAllTimers();

    expect(mockFunction).toBeCalledTimes(1);
  });
});
