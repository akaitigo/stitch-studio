import { useReducer, useCallback } from "react";
import type { Color, EditorAction, EditorState, GridData, Tool } from "../types/grid";

export function colorsMatch(a: Color, b: Color): boolean {
  return a.r === b.r && a.g === b.g && a.b === b.b;
}

function cloneGrid(grid: GridData): GridData {
  return {
    width: grid.width,
    height: grid.height,
    cells: grid.cells.map((c) => ({ ...c })),
    palette: grid.palette.map((c) => ({ ...c })),
  };
}

export function floodFill(
  grid: GridData,
  startX: number,
  startY: number,
  newColor: Color,
): GridData {
  const result = cloneGrid(grid);
  const targetIdx = startY * grid.width + startX;
  const targetColor = result.cells[targetIdx];

  if (colorsMatch(targetColor, newColor)) {
    return result;
  }

  const stack: [number, number][] = [[startX, startY]];
  const visited = new Set<number>();

  while (stack.length > 0) {
    const item = stack.pop();
    if (!item) break;
    const [x, y] = item;
    const idx = y * grid.width + x;

    if (visited.has(idx)) continue;
    visited.add(idx);

    const cell = result.cells[idx];
    if (!colorsMatch(cell, targetColor)) continue;

    result.cells[idx] = { ...newColor };

    if (x > 0) stack.push([x - 1, y]);
    if (x < grid.width - 1) stack.push([x + 1, y]);
    if (y > 0) stack.push([x, y - 1]);
    if (y < grid.height - 1) stack.push([x, y + 1]);
  }

  return result;
}

const MAX_HISTORY = 50;

function pushHistory(state: EditorState, newGrid: GridData): EditorState {
  const history = state.history.slice(0, state.historyIndex + 1);
  history.push(cloneGrid(newGrid));
  if (history.length > MAX_HISTORY) {
    history.shift();
  }
  return {
    ...state,
    grid: newGrid,
    history,
    historyIndex: history.length - 1,
  };
}

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_GRID": {
      const grid = cloneGrid(action.grid);
      return {
        ...state,
        grid,
        history: [cloneGrid(grid)],
        historyIndex: 0,
      };
    }

    case "SET_CELL": {
      if (!state.grid) return state;
      const newGrid = cloneGrid(state.grid);
      const idx = action.y * newGrid.width + action.x;
      if (idx >= 0 && idx < newGrid.cells.length) {
        newGrid.cells[idx] = { ...action.color };
      }
      return pushHistory(state, newGrid);
    }

    case "FLOOD_FILL": {
      if (!state.grid) return state;
      const filled = floodFill(state.grid, action.x, action.y, action.color);
      return pushHistory(state, filled);
    }

    case "SET_TOOL":
      return { ...state, tool: action.tool };

    case "SET_COLOR":
      return { ...state, selectedColor: action.color };

    case "UNDO": {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return {
        ...state,
        grid: cloneGrid(state.history[newIndex]),
        historyIndex: newIndex,
      };
    }

    case "REDO": {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        ...state,
        grid: cloneGrid(state.history[newIndex]),
        historyIndex: newIndex,
      };
    }

    case "NEW_GRID": {
      const cells = Array.from({ length: action.width * action.height }, () => ({
        r: 255,
        g: 255,
        b: 255,
      }));
      const grid: GridData = {
        width: action.width,
        height: action.height,
        cells,
        palette: [{ r: 255, g: 255, b: 255 }],
      };
      return {
        ...state,
        grid,
        history: [cloneGrid(grid)],
        historyIndex: 0,
      };
    }

    default:
      return state;
  }
}

export const initialState: EditorState = {
  grid: null,
  selectedColor: { r: 0, g: 0, b: 0 },
  tool: "pen",
  history: [],
  historyIndex: -1,
};

export function useEditorState() {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  const setGrid = useCallback((grid: GridData) => dispatch({ type: "SET_GRID", grid }), []);
  const setCell = useCallback(
    (x: number, y: number, color: Color) => dispatch({ type: "SET_CELL", x, y, color }),
    [],
  );
  const doFloodFill = useCallback(
    (x: number, y: number, color: Color) => dispatch({ type: "FLOOD_FILL", x, y, color }),
    [],
  );
  const setTool = useCallback((tool: Tool) => dispatch({ type: "SET_TOOL", tool }), []);
  const setColor = useCallback((color: Color) => dispatch({ type: "SET_COLOR", color }), []);
  const undo = useCallback(() => dispatch({ type: "UNDO" }), []);
  const redo = useCallback(() => dispatch({ type: "REDO" }), []);
  const newGrid = useCallback(
    (width: number, height: number) => dispatch({ type: "NEW_GRID", width, height }),
    [],
  );

  return {
    state,
    setGrid,
    setCell,
    doFloodFill,
    setTool,
    setColor,
    undo,
    redo,
    newGrid,
  };
}
