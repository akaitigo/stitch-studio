/**
 * A single RGB color (also used as grid cell).
 *
 * White ({r:255, g:255, b:255}) acts as the "empty" / eraser color.
 * The eraser tool paints cells white, and white cells are treated as
 * transparent (no stitch) when exporting patterns. A dedicated
 * `null`-based empty representation would be cleaner but requires
 * changes across WASM, serialization, and rendering — tracked as a
 * future improvement.
 */
export interface Color {
  r: number;
  g: number;
  b: number;
}

/** Result of image-to-grid conversion from WASM */
export interface GridData {
  width: number;
  height: number;
  cells: Color[];
  palette: Color[];
}

/** Type guard for GridData returned from WASM */
export function isGridData(value: unknown): value is GridData {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  if (typeof obj.width !== "number" || typeof obj.height !== "number") return false;
  if (!Array.isArray(obj.cells) || !Array.isArray(obj.palette)) return false;
  if (obj.cells.length !== obj.width * obj.height) return false;
  const isColor = (c: unknown): c is Color =>
    typeof c === "object" &&
    c !== null &&
    typeof (c as Record<string, unknown>).r === "number" &&
    typeof (c as Record<string, unknown>).g === "number" &&
    typeof (c as Record<string, unknown>).b === "number";
  return obj.cells.every(isColor) && obj.palette.every(isColor);
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
