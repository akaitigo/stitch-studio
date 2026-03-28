import type { Color, Tool } from "../types/grid";

interface ColorPaletteProps {
  palette: Color[];
  selectedColor: Color;
  tool: Tool;
  onColorSelect: (color: Color) => void;
  onToolSelect: (tool: Tool) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function ColorPalette({
  palette,
  selectedColor,
  tool,
  onColorSelect,
  onToolSelect,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: ColorPaletteProps) {
  return (
    <div className="color-palette">
      <h3>Palette</h3>
      <div className="palette-colors">
        {palette.map((color, i) => {
          const isSelected =
            color.r === selectedColor.r &&
            color.g === selectedColor.g &&
            color.b === selectedColor.b;
          return (
            <button
              type="button"
              key={`${color.r}-${color.g}-${color.b}-${i}`}
              className={`palette-swatch ${isSelected ? "selected" : ""}`}
              style={{
                backgroundColor: `rgb(${color.r},${color.g},${color.b})`,
                width: 28,
                height: 28,
                border: isSelected ? "3px solid #333" : "1px solid #aaa",
                borderRadius: 4,
                cursor: "pointer",
                margin: 2,
              }}
              onClick={() => onColorSelect(color)}
              title={`RGB(${color.r}, ${color.g}, ${color.b})`}
              aria-label={`Select color RGB(${color.r}, ${color.g}, ${color.b})`}
            />
          );
        })}
      </div>

      <h3>Tools</h3>
      <div className="tool-buttons">
        <button
          type="button"
          className={tool === "pen" ? "active" : ""}
          onClick={() => onToolSelect("pen")}
        >
          Pen
        </button>
        <button
          type="button"
          className={tool === "fill" ? "active" : ""}
          onClick={() => onToolSelect("fill")}
        >
          Fill
        </button>
        <button
          type="button"
          className={tool === "eraser" ? "active" : ""}
          onClick={() => onToolSelect("eraser")}
        >
          Eraser
        </button>
      </div>

      <h3>History</h3>
      <div className="history-buttons">
        <button type="button" onClick={onUndo} disabled={!canUndo}>
          Undo
        </button>
        <button type="button" onClick={onRedo} disabled={!canRedo}>
          Redo
        </button>
      </div>
    </div>
  );
}
