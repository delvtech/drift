import { randomSelection } from "src/utils/testing/randomSelection";
import { describe, expect, it } from "vitest";

describe("randomSelection", () => {
  it("returns a random element from an array", { repeats: 1_000 }, () => {
    const array = [1, 2, 3, 4, 5];
    const selection = randomSelection(array);
    expect(array).toContain(selection);
  });

  it("returns different elements with sufficient randomness", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const selections = new Set();

    // Make multiple selections and expect variety
    for (let i = 0; i < 100; i++) {
      selections.add(randomSelection(array));
    }

    // With 100 tries on 10 elements, we should get at least half of them
    expect(selections.size).toBeGreaterThanOrEqual(5);
  });

  it("handles arrays with a single element", () => {
    expect(randomSelection([42])).toBe(42);
  });

  it("returns undefined for empty arrays", () => {
    expect(randomSelection([])).toBeUndefined();
  });

  it("can generate boundary elements", () => {
    const results = Array.from({ length: 1000 }, () => randomSelection([0, 1]));
    expect(results).toContain(0);
    expect(results).toContain(1);
    expect(results.every((num) => num === 0 || num === 1)).toBe(true);
  });
});
