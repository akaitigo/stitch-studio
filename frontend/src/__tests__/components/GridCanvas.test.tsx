import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { GridCanvas } from "../../components/GridCanvas";
import type { Color, GridData } from "../../types/grid";

function makeGrid(width: number, height: number): GridData {
  return {
    width,
    height,
    cells: Array.from({ length: width * height }, () => ({
      r: 255,
      g: 255,
      b: 255,
    })),
    palette: [{ r: 255, g: 255, b: 255 }],
  };
}

function mockCanvasContext() {
  const ctx = {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    strokeRect: vi.fn(),
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 0,
  };
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(ctx);
  return ctx;
}

beforeEach(() => {
  mockCanvasContext();
});

afterEach(() => {
  cleanup();
});

describe("GridCanvas", () => {
  it("renders canvas with correct aria-label", () => {
    const grid = makeGrid(10, 8);
    const selectedColor: Color = { r: 0, g: 0, b: 0 };
    render(
      <GridCanvas grid={grid} selectedColor={selectedColor} tool="pen" onCellClick={vi.fn()} />,
    );
    const canvas = screen.getByRole("img");
    expect(canvas).toHaveAttribute("aria-label", "Cross-stitch grid 10x8");
  });

  it("displays grid dimensions", () => {
    const grid = makeGrid(5, 3);
    render(
      <GridCanvas
        grid={grid}
        selectedColor={{ r: 0, g: 0, b: 0 }}
        tool="pen"
        onCellClick={vi.fn()}
      />,
    );
    expect(screen.getByText("5 x 3")).toBeInTheDocument();
  });

  it("renders zoom controls with default 100%", () => {
    const grid = makeGrid(3, 3);
    render(
      <GridCanvas
        grid={grid}
        selectedColor={{ r: 0, g: 0, b: 0 }}
        tool="pen"
        onCellClick={vi.fn()}
      />,
    );
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByTitle("Zoom in")).toBeInTheDocument();
    expect(screen.getByTitle("Zoom out")).toBeInTheDocument();
  });

  it("zoom in increases zoom percentage", () => {
    const grid = makeGrid(3, 3);
    render(
      <GridCanvas
        grid={grid}
        selectedColor={{ r: 0, g: 0, b: 0 }}
        tool="pen"
        onCellClick={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTitle("Zoom in"));
    expect(screen.getByText("125%")).toBeInTheDocument();
  });
});
