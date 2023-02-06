import { it, expect } from "vitest";
import { decimalCount } from "../decimalCount";

describe("decimalCount function test", () => {
  it("decimalCount should return length 1 of decimal", () => {
    expect(decimalCount("4.1")).toEqual(1);
  });

  it("decimalCount should return length 0 because no decimal found", () => {
    expect(decimalCount("5")).toEqual(0);
  });
});
