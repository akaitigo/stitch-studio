import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../../App";

// Mock canvas context for GridCanvas
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

afterEach(() => {
  cleanup();
});

describe("App", () => {
  it("renders the welcome screen initially", () => {
    const { container } = render(<App />);
    const app = container.querySelector(".app");
    expect(app).not.toBeNull();
    expect(within(app as HTMLElement).getByText("Welcome to stitch-studio")).toBeInTheDocument();
  });

  it("renders the header with app title", () => {
    const { container } = render(<App />);
    const header = container.querySelector(".app-header h1");
    expect(header).not.toBeNull();
    expect(header?.textContent).toBe("stitch-studio");
  });

  it("opens New Grid modal on button click", () => {
    const { container } = render(<App />);
    const app = within(container.querySelector(".app") as HTMLElement);
    // Click "New Grid" in the welcome section
    fireEvent.click(app.getByText("New Grid"));
    expect(app.getByText("Create")).toBeInTheDocument();
  });

  it("opens Import dialog on button click", () => {
    const { container } = render(<App />);
    const app = within(container.querySelector(".app") as HTMLElement);
    fireEvent.click(app.getByText("Import Image"));
    // The dialog heading "Import Image" as h2
    expect(app.getByRole("dialog")).toBeInTheDocument();
  });

  it("creates new grid and switches to editor view", () => {
    mockCanvasContext();
    const { container } = render(<App />);
    const app = within(container.querySelector(".app") as HTMLElement);
    // Open New Grid modal
    fireEvent.click(app.getByText("New Grid"));
    // Click Create
    fireEvent.click(app.getByText("Create"));
    // Should now show editor UI elements
    expect(app.getByText("Palette")).toBeInTheDocument();
    expect(app.getByText("Thread Shopping List")).toBeInTheDocument();
  });
});
