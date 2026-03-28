import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ImportDialog } from "../../components/ImportDialog";

afterEach(() => {
  cleanup();
});

describe("ImportDialog", () => {
  it("renders the dialog with Import Image heading", () => {
    render(<ImportDialog onImport={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByRole("heading", { name: "Import Image" })).toBeInTheDocument();
  });

  it("renders file input for images", () => {
    render(<ImportDialog onImport={vi.fn()} onClose={vi.fn()} />);
    const dialog = screen.getByRole("dialog");
    const fileInput = dialog.querySelector("input[type='file']");
    expect(fileInput).not.toBeNull();
    expect(fileInput?.getAttribute("accept")).toBe("image/png,image/jpeg");
  });

  it("renders grid dimension inputs", () => {
    render(<ImportDialog onImport={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText("Grid Width:")).toBeInTheDocument();
    expect(screen.getByText("Grid Height:")).toBeInTheDocument();
    expect(screen.getByText("Max Colors:")).toBeInTheDocument();
  });

  it("Convert button is disabled when no image is loaded", () => {
    render(<ImportDialog onImport={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Convert" })).toBeDisabled();
  });

  it("calls onClose when Cancel is clicked", () => {
    const onClose = vi.fn();
    render(<ImportDialog onImport={vi.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
