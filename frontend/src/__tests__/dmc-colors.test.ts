import { describe, it, expect } from "vitest";
import {
  findNearestDmc,
  calculateSkeins,
  generateShoppingList,
  colorDistanceSq,
} from "../utils/dmc-colors";

describe("colorDistanceSq", () => {
  it("returns 0 for identical colors", () => {
    const color = { r: 128, g: 64, b: 32 };
    expect(colorDistanceSq(color, color)).toBe(0);
  });

  it("calculates correct distance for known values", () => {
    const a = { r: 255, g: 0, b: 0 };
    const b = { r: 0, g: 255, b: 0 };
    expect(colorDistanceSq(a, b)).toBe(255 * 255 + 255 * 255);
  });
});

describe("findNearestDmc", () => {
  it("finds black for pure black", () => {
    const result = findNearestDmc({ r: 0, g: 0, b: 0 });
    expect(result.code).toBe("310");
    expect(result.name).toBe("Black");
  });

  it("finds white for pure white", () => {
    const result = findNearestDmc({ r: 255, g: 255, b: 255 });
    expect(result.code).toBe("White");
  });

  it("finds a red thread for a red-ish color", () => {
    const result = findNearestDmc({ r: 200, g: 40, b: 50 });
    expect(result.code).toBe("321");
  });
});

describe("calculateSkeins", () => {
  it("returns 1 for small counts", () => {
    expect(calculateSkeins(1)).toBe(1);
    expect(calculateSkeins(400)).toBe(1);
  });

  it("rounds up to next skein", () => {
    expect(calculateSkeins(401)).toBe(2);
    expect(calculateSkeins(800)).toBe(2);
    expect(calculateSkeins(801)).toBe(3);
  });
});

describe("generateShoppingList", () => {
  it("returns empty for no cells", () => {
    expect(generateShoppingList([])).toEqual([]);
  });

  it("excludes white cells", () => {
    const cells = [
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
    ];
    expect(generateShoppingList(cells)).toEqual([]);
  });

  it("groups same-color cells", () => {
    const cells = [
      { r: 0, g: 0, b: 0 },
      { r: 0, g: 0, b: 0 },
      { r: 0, g: 0, b: 0 },
    ];
    const result = generateShoppingList(cells);
    expect(result).toHaveLength(1);
    expect(result[0].stitchCount).toBe(3);
    expect(result[0].thread.code).toBe("310");
  });

  it("sorts by stitch count descending", () => {
    const cells = [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 0, b: 0 },
      { r: 255, g: 0, b: 0 },
      { r: 255, g: 0, b: 0 },
    ];
    const result = generateShoppingList(cells);
    expect(result).toHaveLength(2);
    expect(result[0].stitchCount).toBe(3); // red
    expect(result[1].stitchCount).toBe(1); // black
  });
});
