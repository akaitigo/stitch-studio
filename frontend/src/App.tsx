import { useCallback, useMemo, useState } from "react";
import { ColorPalette } from "./components/ColorPalette";
import { GridCanvas } from "./components/GridCanvas";
import { ImportDialog } from "./components/ImportDialog";
import { Modal } from "./components/Modal";
import { ThreadList } from "./components/ThreadList";
import { useEditorState } from "./hooks/useEditorState";
import type { GridData } from "./types/grid";
import { generateShoppingList } from "./utils/dmc-colors";
import "./App.css";

function App() {
  const { state, setGrid, setCell, doFloodFill, setTool, setColor, undo, redo, newGrid } =
    useEditorState();

  const [showImport, setShowImport] = useState(false);
  const [showNewGrid, setShowNewGrid] = useState(false);
  const [newWidth, setNewWidth] = useState(20);
  const [newHeight, setNewHeight] = useState(20);

  const handleCellClick = useCallback(
    (x: number, y: number) => {
      if (state.tool === "fill") {
        doFloodFill(x, y, state.selectedColor);
      } else if (state.tool === "eraser") {
        setCell(x, y, { r: 255, g: 255, b: 255 });
      } else {
        setCell(x, y, state.selectedColor);
      }
    },
    [state.tool, state.selectedColor, doFloodFill, setCell],
  );

  const handleImport = useCallback(
    (grid: GridData) => {
      setGrid(grid);
      setShowImport(false);
    },
    [setGrid],
  );

  const clampGridSize = useCallback((value: number): number => {
    if (Number.isNaN(value) || value < 1) return 1;
    if (value > 200) return 200;
    return Math.floor(value);
  }, []);

  const handleNewGrid = useCallback(() => {
    const w = clampGridSize(newWidth);
    const h = clampGridSize(newHeight);
    newGrid(w, h);
    setShowNewGrid(false);
  }, [newGrid, newWidth, newHeight, clampGridSize]);

  const threadUsages = useMemo(() => {
    if (!state.grid) return [];
    return generateShoppingList(state.grid.cells);
  }, [state.grid]);

  const palette = useMemo(() => {
    if (!state.grid) return [];
    return state.grid.palette;
  }, [state.grid]);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  return (
    <div className="app">
      <header className="app-header">
        <h1>stitch-studio</h1>
        <nav className="app-nav">
          <button type="button" onClick={() => setShowNewGrid(true)}>
            New
          </button>
          <button type="button" onClick={() => setShowImport(true)}>
            Import
          </button>
        </nav>
      </header>

      <main className="app-main">
        {state.grid ? (
          <div className="editor-layout">
            <aside className="editor-sidebar-left">
              <ColorPalette
                palette={palette}
                selectedColor={state.selectedColor}
                tool={state.tool}
                onColorSelect={setColor}
                onToolSelect={setTool}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
              />
            </aside>
            <section className="editor-canvas">
              <GridCanvas
                grid={state.grid}
                selectedColor={state.selectedColor}
                tool={state.tool}
                onCellClick={handleCellClick}
              />
            </section>
            <aside className="editor-sidebar-right">
              <ThreadList usages={threadUsages} />
            </aside>
          </div>
        ) : (
          <div className="welcome">
            <h2>Welcome to stitch-studio</h2>
            <p>Create cross-stitch patterns from images or start from scratch.</p>
            <div className="welcome-actions">
              <button type="button" className="btn-primary" onClick={() => setShowNewGrid(true)}>
                New Grid
              </button>
              <button type="button" className="btn-primary" onClick={() => setShowImport(true)}>
                Import Image
              </button>
            </div>
          </div>
        )}
      </main>

      {showImport && <ImportDialog onImport={handleImport} onClose={() => setShowImport(false)} />}

      {showNewGrid && (
        <Modal onClose={() => setShowNewGrid(false)}>
          <h2>New Grid</h2>
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <label>
              Width:
              <input
                type="number"
                value={newWidth}
                onChange={(e) => setNewWidth(clampGridSize(Number(e.target.value)))}
                min={1}
                max={200}
                style={{ width: 60, marginLeft: 8 }}
              />
            </label>
            <label>
              Height:
              <input
                type="number"
                value={newHeight}
                onChange={(e) => setNewHeight(clampGridSize(Number(e.target.value)))}
                min={1}
                max={200}
                style={{ width: 60, marginLeft: 8 }}
              />
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={() => setShowNewGrid(false)}>
              Cancel
            </button>
            <button type="button" className="btn-primary" onClick={handleNewGrid}>
              Create
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default App;
