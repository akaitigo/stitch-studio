import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ColorPalette } from "../../components/ColorPalette";
import type { Color } from "../../types/grid";

afterEach(() => {
  cleanup();
});

const palette: Color[] = [
  { r: 255, g: 0, b: 0 },
  { r: 0, g: 255, b: 0 },
  { r: 0, g: 0, b: 255 },
];

const defaultProps = {
  palette,
  selectedColor: palette[0],
  tool: "pen" as const,
  onColorSelect: vi.fn(),
  onToolSelect: vi.fn(),
  onUndo: vi.fn(),
  onRedo: vi.fn(),
  canUndo: false,
  canRedo: false,
};

describe("ColorPalette", () => {
  it("renders palette swatches", () => {
    render(<ColorPalette {...defaultProps} />);
    const swatches = screen.getAllByRole("button", { name: /Select color/ });
    expect(swatches).toHaveLength(3);
  });

  it("calls onColorSelect when a swatch is clicked", () => {
    const onColorSelect = vi.fn();
    render(<ColorPalette {...defaultProps} onColorSelect={onColorSelect} />);
    const swatches = screen.getAllByRole("button", { name: /Select color/ });
    fireEvent.click(swatches[1]);
    expect(onColorSelect).toHaveBeenCalledWith({ r: 0, g: 255, b: 0 });
  });

  it("renders tool buttons", () => {
    render(<ColorPalette {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Pen" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fill" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eraser" })).toBeInTheDocument();
  });

  it("calls onToolSelect when a tool button is clicked", () => {
    const onToolSelect = vi.fn();
    render(<ColorPalette {...defaultProps} onToolSelect={onToolSelect} />);
    fireEvent.click(screen.getByRole("button", { name: "Fill" }));
    expect(onToolSelect).toHaveBeenCalledWith("fill");
  });

  it("marks the active tool button", () => {
    render(<ColorPalette {...defaultProps} tool="fill" />);
    expect(screen.getByRole("button", { name: "Fill" })).toHaveClass("active");
    expect(screen.getByRole("button", { name: "Pen" })).not.toHaveClass("active");
  });

  it("disables undo/redo buttons when not available", () => {
    render(<ColorPalette {...defaultProps} canUndo={false} canRedo={false} />);
    expect(screen.getByRole("button", { name: "Undo" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Redo" })).toBeDisabled();
  });

  it("enables undo/redo buttons when available", () => {
    render(<ColorPalette {...defaultProps} canUndo={true} canRedo={true} />);
    expect(screen.getByRole("button", { name: "Undo" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Redo" })).toBeEnabled();
  });

  it("calls onUndo and onRedo when clicked", () => {
    const onUndo = vi.fn();
    const onRedo = vi.fn();
    render(
      <ColorPalette
        {...defaultProps}
        canUndo={true}
        canRedo={true}
        onUndo={onUndo}
        onRedo={onRedo}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    fireEvent.click(screen.getByRole("button", { name: "Redo" }));
    expect(onUndo).toHaveBeenCalledOnce();
    expect(onRedo).toHaveBeenCalledOnce();
  });
});
