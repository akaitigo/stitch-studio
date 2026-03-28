import { describe, it, expect } from "vitest";
import { editorReducer, floodFill, colorsMatch, initialState } from "../hooks/useEditorState";
import type { Color, EditorState, GridData } from "../types/grid";

function makeGrid(
  width: number,
  height: number,
  fill: Color = { r: 255, g: 255, b: 255 },
): GridData {
  return {
    width,
    height,
    cells: Array.from({ length: width * height }, () => ({ ...fill })),
    palette: [{ ...fill }],
  };
}

function stateWithGrid(grid: GridData): EditorState {
  return editorReducer(initialState, { type: "SET_GRID", grid });
}

// --- colorsMatch ---

describe("colorsMatch", () => {
  it("returns true for identical colors", () => {
    expect(colorsMatch({ r: 10, g: 20, b: 30 }, { r: 10, g: 20, b: 30 })).toBe(true);
  });

  it("returns false for different colors", () => {
    expect(colorsMatch({ r: 10, g: 20, b: 30 }, { r: 10, g: 20, b: 31 })).toBe(false);
  });
});

// --- floodFill ---

describe("floodFill", () => {
  it("fills a single-color grid entirely", () => {
    const grid = makeGrid(3, 3, { r: 255, g: 255, b: 255 });
    const filled = floodFill(grid, 1, 1, { r: 255, g: 0, b: 0 });
    for (const cell of filled.cells) {
      expect(cell).toEqual({ r: 255, g: 0, b: 0 });
    }
  });

  it("does nothing when target and fill colors match", () => {
    const grid = makeGrid(3, 3, { r: 100, g: 100, b: 100 });
    const filled = floodFill(grid, 0, 0, { r: 100, g: 100, b: 100 });
    expect(filled.cells).toEqual(grid.cells);
  });

  it("fills only the connected region", () => {
    const grid = makeGrid(3, 3, { r: 255, g: 255, b: 255 });
    // Create a barrier in the middle row
    grid.cells[3] = { r: 0, g: 0, b: 0 }; // (0,1)
    grid.cells[4] = { r: 0, g: 0, b: 0 }; // (1,1)
    grid.cells[5] = { r: 0, g: 0, b: 0 }; // (2,1)

    const filled = floodFill(grid, 0, 0, { r: 255, g: 0, b: 0 });
    // Top row should be red
    expect(filled.cells[0]).toEqual({ r: 255, g: 0, b: 0 });
    expect(filled.cells[1]).toEqual({ r: 255, g: 0, b: 0 });
    expect(filled.cells[2]).toEqual({ r: 255, g: 0, b: 0 });
    // Middle row (barrier) should remain black
    expect(filled.cells[3]).toEqual({ r: 0, g: 0, b: 0 });
    // Bottom row should remain white (not connected)
    expect(filled.cells[6]).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("fills corner cells correctly", () => {
    const grid = makeGrid(2, 2, { r: 255, g: 255, b: 255 });
    grid.cells[1] = { r: 0, g: 0, b: 0 }; // (1,0) barrier
    grid.cells[2] = { r: 0, g: 0, b: 0 }; // (0,1) barrier

    const filled = floodFill(grid, 0, 0, { r: 255, g: 0, b: 0 });
    expect(filled.cells[0]).toEqual({ r: 255, g: 0, b: 0 }); // (0,0) filled
    expect(filled.cells[3]).toEqual({ r: 255, g: 255, b: 255 }); // (1,1) untouched
  });

  it("does not mutate the original grid", () => {
    const grid = makeGrid(2, 2, { r: 255, g: 255, b: 255 });
    const originalCells = grid.cells.map((c) => ({ ...c }));
    floodFill(grid, 0, 0, { r: 0, g: 0, b: 0 });
    expect(grid.cells).toEqual(originalCells);
  });
});

// --- editorReducer ---

describe("editorReducer", () => {
  describe("SET_GRID", () => {
    it("sets grid and initializes history", () => {
      const grid = makeGrid(3, 3);
      const state = editorReducer(initialState, { type: "SET_GRID", grid });
      expect(state.grid).not.toBeNull();
      expect(state.grid?.width).toBe(3);
      expect(state.history).toHaveLength(1);
      expect(state.historyIndex).toBe(0);
    });
  });

  describe("SET_CELL", () => {
    it("sets a cell color and pushes history", () => {
      const state = stateWithGrid(makeGrid(3, 3));
      const next = editorReducer(state, {
        type: "SET_CELL",
        x: 1,
        y: 1,
        color: { r: 255, g: 0, b: 0 },
      });
      const idx = 1 * 3 + 1;
      expect(next.grid?.cells[idx]).toEqual({ r: 255, g: 0, b: 0 });
      expect(next.history).toHaveLength(2);
      expect(next.historyIndex).toBe(1);
    });

    it("ignores out-of-bounds index gracefully", () => {
      const state = stateWithGrid(makeGrid(2, 2));
      const next = editorReducer(state, {
        type: "SET_CELL",
        x: 10,
        y: 10,
        color: { r: 255, g: 0, b: 0 },
      });
      // Out of bounds should still push history (cells unchanged but cloned)
      expect(next.grid?.cells).toHaveLength(4);
    });

    it("returns state unchanged when grid is null", () => {
      const next = editorReducer(initialState, {
        type: "SET_CELL",
        x: 0,
        y: 0,
        color: { r: 0, g: 0, b: 0 },
      });
      expect(next).toBe(initialState);
    });
  });

  describe("FLOOD_FILL", () => {
    it("fills connected area and pushes history", () => {
      const state = stateWithGrid(makeGrid(3, 3));
      const next = editorReducer(state, {
        type: "FLOOD_FILL",
        x: 0,
        y: 0,
        color: { r: 0, g: 255, b: 0 },
      });
      expect(next.grid?.cells[0]).toEqual({ r: 0, g: 255, b: 0 });
      expect(next.history).toHaveLength(2);
    });

    it("returns state unchanged when grid is null", () => {
      const next = editorReducer(initialState, {
        type: "FLOOD_FILL",
        x: 0,
        y: 0,
        color: { r: 0, g: 0, b: 0 },
      });
      expect(next).toBe(initialState);
    });
  });

  describe("SET_TOOL", () => {
    it("changes the active tool", () => {
      const next = editorReducer(initialState, { type: "SET_TOOL", tool: "fill" });
      expect(next.tool).toBe("fill");
    });
  });

  describe("SET_COLOR", () => {
    it("changes the selected color", () => {
      const color = { r: 128, g: 64, b: 32 };
      const next = editorReducer(initialState, { type: "SET_COLOR", color });
      expect(next.selectedColor).toEqual(color);
    });
  });

  describe("UNDO / REDO", () => {
    it("undo reverts to previous state", () => {
      const state = stateWithGrid(makeGrid(2, 2));
      const painted = editorReducer(state, {
        type: "SET_CELL",
        x: 0,
        y: 0,
        color: { r: 255, g: 0, b: 0 },
      });
      expect(painted.grid?.cells[0]).toEqual({ r: 255, g: 0, b: 0 });

      const undone = editorReducer(painted, { type: "UNDO" });
      expect(undone.grid?.cells[0]).toEqual({ r: 255, g: 255, b: 255 });
      expect(undone.historyIndex).toBe(0);
    });

    it("redo restores undone state", () => {
      const state = stateWithGrid(makeGrid(2, 2));
      const painted = editorReducer(state, {
        type: "SET_CELL",
        x: 0,
        y: 0,
        color: { r: 255, g: 0, b: 0 },
      });
      const undone = editorReducer(painted, { type: "UNDO" });
      const redone = editorReducer(undone, { type: "REDO" });

      expect(redone.grid?.cells[0]).toEqual({ r: 255, g: 0, b: 0 });
      expect(redone.historyIndex).toBe(1);
    });

    it("undo at beginning does nothing", () => {
      const state = stateWithGrid(makeGrid(2, 2));
      const undone = editorReducer(state, { type: "UNDO" });
      expect(undone).toBe(state);
    });

    it("redo at end does nothing", () => {
      const state = stateWithGrid(makeGrid(2, 2));
      const redone = editorReducer(state, { type: "REDO" });
      expect(redone).toBe(state);
    });

    it("undo from empty history does nothing", () => {
      const undone = editorReducer(initialState, { type: "UNDO" });
      expect(undone).toBe(initialState);
    });

    it("multiple undo/redo cycle works correctly", () => {
      let state = stateWithGrid(makeGrid(2, 2));
      // Paint 3 cells
      state = editorReducer(state, { type: "SET_CELL", x: 0, y: 0, color: { r: 255, g: 0, b: 0 } });
      state = editorReducer(state, { type: "SET_CELL", x: 1, y: 0, color: { r: 0, g: 255, b: 0 } });
      state = editorReducer(state, { type: "SET_CELL", x: 0, y: 1, color: { r: 0, g: 0, b: 255 } });
      expect(state.historyIndex).toBe(3);

      // Undo twice
      state = editorReducer(state, { type: "UNDO" });
      state = editorReducer(state, { type: "UNDO" });
      expect(state.historyIndex).toBe(1);
      expect(state.grid?.cells[0]).toEqual({ r: 255, g: 0, b: 0 }); // First paint still there

      // Redo once
      state = editorReducer(state, { type: "REDO" });
      expect(state.historyIndex).toBe(2);
      expect(state.grid?.cells[1]).toEqual({ r: 0, g: 255, b: 0 }); // Second paint restored
    });

    it("new action after undo discards redo history", () => {
      let state = stateWithGrid(makeGrid(2, 2));
      state = editorReducer(state, { type: "SET_CELL", x: 0, y: 0, color: { r: 255, g: 0, b: 0 } });
      state = editorReducer(state, { type: "SET_CELL", x: 1, y: 0, color: { r: 0, g: 255, b: 0 } });

      // Undo once
      state = editorReducer(state, { type: "UNDO" });
      // New action
      state = editorReducer(state, { type: "SET_CELL", x: 0, y: 1, color: { r: 0, g: 0, b: 255 } });

      // Redo should do nothing (redo history was discarded)
      const afterRedo = editorReducer(state, { type: "REDO" });
      expect(afterRedo).toBe(state);
    });
  });

  describe("NEW_GRID", () => {
    it("creates a new white grid with correct dimensions", () => {
      const state = editorReducer(initialState, { type: "NEW_GRID", width: 5, height: 4 });
      expect(state.grid?.width).toBe(5);
      expect(state.grid?.height).toBe(4);
      expect(state.grid?.cells).toHaveLength(20);
      expect(state.grid?.cells[0]).toEqual({ r: 255, g: 255, b: 255 });
      expect(state.history).toHaveLength(1);
      expect(state.historyIndex).toBe(0);
    });
  });
});
