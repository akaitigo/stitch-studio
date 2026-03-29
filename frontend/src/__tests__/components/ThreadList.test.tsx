import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ThreadList } from "../../components/ThreadList";
import type { ThreadUsage } from "../../utils/dmc-colors";

afterEach(() => {
  cleanup();
});

describe("ThreadList", () => {
  it("renders empty message when no usages", () => {
    render(<ThreadList usages={[]} />);
    expect(screen.getByText("No threads yet. Start drawing!")).toBeInTheDocument();
  });

  it("renders table with thread data", () => {
    const usages: ThreadUsage[] = [
      {
        thread: {
          code: "310",
          name: "Black",
          color: { r: 0, g: 0, b: 0 },
        },
        stitchCount: 100,
        skeins: 1,
      },
      {
        thread: {
          code: "321",
          name: "Red",
          color: { r: 199, g: 43, b: 59 },
        },
        stitchCount: 50,
        skeins: 1,
      },
    ];
    render(<ThreadList usages={usages} />);
    expect(screen.getByText("310")).toBeInTheDocument();
    expect(screen.getByText("Black")).toBeInTheDocument();
    expect(screen.getByText("321")).toBeInTheDocument();
    expect(screen.getByText("Red")).toBeInTheDocument();
  });

  it("shows totals", () => {
    const usages: ThreadUsage[] = [
      {
        thread: { code: "310", name: "Black", color: { r: 0, g: 0, b: 0 } },
        stitchCount: 300,
        skeins: 1,
      },
      {
        thread: { code: "321", name: "Red", color: { r: 199, g: 43, b: 59 } },
        stitchCount: 200,
        skeins: 1,
      },
    ];
    render(<ThreadList usages={usages} />);
    expect(screen.getByText("Total: 500 stitches, 2 skeins")).toBeInTheDocument();
  });

  it("renders the correct number of data rows", () => {
    const usages: ThreadUsage[] = [
      {
        thread: { code: "310", name: "Black", color: { r: 0, g: 0, b: 0 } },
        stitchCount: 10,
        skeins: 1,
      },
    ];
    render(<ThreadList usages={usages} />);
    const table = screen.getByRole("table");
    const tbody = table.querySelector("tbody");
    expect(tbody).not.toBeNull();
    const rows = within(tbody as HTMLElement).getAllByRole("row");
    expect(rows).toHaveLength(1);
  });
});
