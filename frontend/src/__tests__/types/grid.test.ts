import { describe, expect, it } from "vitest";
import { isGridData } from "../../types/grid";

describe("isGridData", () => {
  it("returns true for valid GridData", () => {
    const data = {
      width: 2,
      height: 2,
      cells: [
        { r: 0, g: 0, b: 0 },
        { r: 255, g: 255, b: 255 },
        { r: 128, g: 64, b: 32 },
        { r: 100, g: 100, b: 100 },
      ],
      palette: [
        { r: 0, g: 0, b: 0 },
        { r: 255, g: 255, b: 255 },
      ],
    };
    expect(isGridData(data)).toBe(true);
  });

  it("returns false for null", () => {
    expect(isGridData(null)).toBe(false);
  });

  it("returns false for non-object", () => {
    expect(isGridData("string")).toBe(false);
    expect(isGridData(42)).toBe(false);
  });

  it("returns false when width is missing", () => {
    expect(
      isGridData({
        height: 1,
        cells: [{ r: 0, g: 0, b: 0 }],
        palette: [{ r: 0, g: 0, b: 0 }],
      }),
    ).toBe(false);
  });

  it("returns false when cells length mismatches dimensions", () => {
    expect(
      isGridData({
        width: 2,
        height: 2,
        cells: [{ r: 0, g: 0, b: 0 }], // should be 4
        palette: [{ r: 0, g: 0, b: 0 }],
      }),
    ).toBe(false);
  });

  it("returns false when cells contain invalid items", () => {
    expect(
      isGridData({
        width: 1,
        height: 1,
        cells: [{ r: "not a number", g: 0, b: 0 }],
        palette: [{ r: 0, g: 0, b: 0 }],
      }),
    ).toBe(false);
  });

  it("returns false when palette contains invalid items", () => {
    expect(
      isGridData({
        width: 1,
        height: 1,
        cells: [{ r: 0, g: 0, b: 0 }],
        palette: [{ invalid: true }],
      }),
    ).toBe(false);
  });
});
