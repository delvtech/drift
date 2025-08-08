import { describe } from "node:test";
import { computeCoverage } from "src/normalizedCache";
import { expect, test } from "vitest";

describe("computeMissingRanges", () => {
  test("fully covered", () => {
    const result = computeCoverage(
      [
        { fromBlock: 0n, toBlock: 10n },
        { fromBlock: 20n, toBlock: 30n },
        { fromBlock: 40n, toBlock: 50n },
        { fromBlock: 60n, toBlock: 70n },
      ],
      { fromBlock: 25n, toBlock: 28n },
    );
    expect(result.missing).toEqual([]);
    expect(result.merged).toEqual([
      { fromBlock: 0n, toBlock: 10n },
      { fromBlock: 20n, toBlock: 30n },
      { fromBlock: 40n, toBlock: 50n },
      { fromBlock: 60n, toBlock: 70n },
    ]);
  });

  test("starts inside one covered, ends inside another covered", () => {
    const result = computeCoverage(
      [
        { fromBlock: 0n, toBlock: 10n },
        { fromBlock: 20n, toBlock: 30n },
        { fromBlock: 40n, toBlock: 50n },
        { fromBlock: 60n, toBlock: 70n },
      ],
      { fromBlock: 25n, toBlock: 45n },
    );
    expect(result.missing).toEqual([{ fromBlock: 31n, toBlock: 39n }]);
    expect(result.merged).toEqual([
      { fromBlock: 0n, toBlock: 10n },
      { fromBlock: 20n, toBlock: 50n },
      { fromBlock: 60n, toBlock: 70n },
    ]);
  });

  test("starts between covered, ends inside covered", () => {
    const result = computeCoverage(
      [
        { fromBlock: 0n, toBlock: 10n },
        { fromBlock: 20n, toBlock: 30n },
        { fromBlock: 40n, toBlock: 50n },
        { fromBlock: 60n, toBlock: 70n },
      ],
      { fromBlock: 15n, toBlock: 45n },
    );
    expect(result.missing).toEqual([
      { fromBlock: 15n, toBlock: 19n },
      { fromBlock: 31n, toBlock: 39n },
    ]);
    expect(result.merged).toEqual([
      { fromBlock: 0n, toBlock: 10n },
      { fromBlock: 15n, toBlock: 50n },
      { fromBlock: 60n, toBlock: 70n },
    ]);
  });

  test("starts between covered, ends between covered", () => {
    const result = computeCoverage(
      [
        { fromBlock: 0n, toBlock: 10n },
        { fromBlock: 20n, toBlock: 30n },
        { fromBlock: 40n, toBlock: 50n },
        { fromBlock: 60n, toBlock: 70n },
      ],
      { fromBlock: 15n, toBlock: 55n },
    );
    expect(result.missing).toEqual([
      { fromBlock: 15n, toBlock: 19n },
      { fromBlock: 31n, toBlock: 39n },
      { fromBlock: 51n, toBlock: 55n },
    ]);
    expect(result.merged).toEqual([
      { fromBlock: 0n, toBlock: 10n },
      { fromBlock: 15n, toBlock: 55n },
      { fromBlock: 60n, toBlock: 70n },
    ]);
  });

  test("adjacent ranges", () => {
    const result = computeCoverage(
      [
        { fromBlock: 0n, toBlock: 10n },
        { fromBlock: 20n, toBlock: 30n },
        { fromBlock: 40n, toBlock: 50n },
        { fromBlock: 60n, toBlock: 70n },
      ],
      { fromBlock: 31n, toBlock: 41n },
    );
    expect(result.missing).toEqual([{ fromBlock: 31n, toBlock: 39n }]);
    expect(result.merged).toEqual([
      { fromBlock: 0n, toBlock: 10n },
      { fromBlock: 20n, toBlock: 50n },
      { fromBlock: 60n, toBlock: 70n },
    ]);
  });
});
