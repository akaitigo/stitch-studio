import { useCallback, useEffect, useRef, useState } from "react";
import type { Color, GridData, Tool } from "../types/grid";

interface GridCanvasProps {
  grid: GridData;
  selectedColor: Color;
  tool: Tool;
  onCellClick: (x: number, y: number) => void;
}

const CELL_SIZE = 20;
const GRID_LINE_COLOR = "#ccc";
const GRID_BORDER_COLOR = "#999";

export function GridCanvas({ grid, selectedColor, tool, onCellClick }: GridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isPainting, setIsPainting] = useState(false);
  const lastPaintedRef = useRef<string | null>(null);

  const cellSize = CELL_SIZE * zoom;
  const canvasWidth = grid.width * cellSize + 1;
  const canvasHeight = grid.height * cellSize + 1;

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cells
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const cell = grid.cells[y * grid.width + x];
        ctx.fillStyle = `rgb(${cell.r},${cell.g},${cell.b})`;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }

    // Draw grid lines
    ctx.strokeStyle = GRID_LINE_COLOR;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= grid.width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize + 0.5, 0);
      ctx.lineTo(x * cellSize + 0.5, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= grid.height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize + 0.5);
      ctx.lineTo(canvasWidth, y * cellSize + 0.5);
      ctx.stroke();
    }

    // Draw border
    ctx.strokeStyle = GRID_BORDER_COLOR;
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, grid.width * cellSize, grid.height * cellSize);
  }, [grid, cellSize, canvasWidth, canvasHeight]);

  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  const getCellFromEvent = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / cellSize);
      const y = Math.floor((e.clientY - rect.top) / cellSize);
      if (x >= 0 && x < grid.width && y >= 0 && y < grid.height) {
        return { x, y };
      }
      return null;
    },
    [cellSize, grid.width, grid.height],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const cell = getCellFromEvent(e);
      if (!cell) return;

      if (tool === "pen" || tool === "eraser" || tool === "fill") {
        setIsPainting(true);
        lastPaintedRef.current = `${cell.x},${cell.y}`;
        onCellClick(cell.x, cell.y);
      }
    },
    [getCellFromEvent, tool, onCellClick],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isPainting) return;
      if (tool === "fill") return; // Fill only triggers once
      const cell = getCellFromEvent(e);
      if (!cell) return;
      const key = `${cell.x},${cell.y}`;
      if (key === lastPaintedRef.current) return;
      lastPaintedRef.current = key;
      onCellClick(cell.x, cell.y);
    },
    [isPainting, tool, getCellFromEvent, onCellClick],
  );

  const handleMouseUp = useCallback(() => {
    setIsPainting(false);
    lastPaintedRef.current = null;
  }, []);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(z + 0.25, 3)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(z - 0.25, 0.25)), []);

  const cursorStyle = tool === "fill" ? "crosshair" : tool === "eraser" ? "cell" : "pointer";

  return (
    <div className="grid-canvas-container">
      <div className="grid-toolbar">
        <button type="button" onClick={zoomOut} title="Zoom out">
          -
        </button>
        <span>{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={zoomIn} title="Zoom in">
          +
        </button>
        <span className="grid-info">
          {grid.width} x {grid.height}
        </span>
      </div>
      <div className="grid-scroll" style={{ overflow: "auto", maxHeight: "70vh" }}>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ cursor: cursorStyle, imageRendering: "pixelated" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          aria-label={`Cross-stitch grid ${grid.width}x${grid.height}`}
          role="img"
        />
      </div>
      <div className="grid-selected-color">
        Selected:{" "}
        <span
          className="color-swatch"
          style={{
            backgroundColor: `rgb(${selectedColor.r},${selectedColor.g},${selectedColor.b})`,
            display: "inline-block",
            width: 16,
            height: 16,
            border: "1px solid #333",
            verticalAlign: "middle",
          }}
        />
      </div>
    </div>
  );
}
