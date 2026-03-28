/** A single RGB color */
export interface Color {
  r: number;
  g: number;
  b: number;
}

/** A cell in the cross-stitch grid */
export interface GridCell {
  r: number;
  g: number;
  b: number;
}

/** Result of image-to-grid conversion from WASM */
export interface GridData {
  width: number;
  height: number;
  cells: GridCell[];
  palette: GridCell[];
}

/** Available editor tools */
export type Tool = "pen" | "fill" | "eraser";

/** Editor state */
export interface EditorState {
  grid: GridData | null;
  selectedColor: Color;
  tool: Tool;
  history: GridData[];
  historyIndex: number;
}

/** Action types for editor reducer */
export type EditorAction =
  | { type: "SET_GRID"; grid: GridData }
  | { type: "SET_CELL"; x: number; y: number; color: Color }
  | { type: "FLOOD_FILL"; x: number; y: number; color: Color }
  | { type: "SET_TOOL"; tool: Tool }
  | { type: "SET_COLOR"; color: Color }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "NEW_GRID"; width: number; height: number };
