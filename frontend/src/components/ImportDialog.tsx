import { useCallback, useRef, useState } from "react";
import type { GridData } from "../types/grid";
import { isGridData } from "../types/grid";
import { Modal } from "./Modal";

interface ImportDialogProps {
  onImport: (grid: GridData) => void;
  onClose: () => void;
}

export function ImportDialog({ onImport, onClose }: ImportDialogProps) {
  const [gridWidth, setGridWidth] = useState(40);
  const [gridHeight, setGridHeight] = useState(30);
  const [maxColors, setMaxColors] = useState(16);
  const [imageData, setImageData] = useState<{
    rgba: Uint8Array;
    width: number;
    height: number;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    const MAX_DIMENSION = 4096;

    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 10 MB.`);
      return;
    }

    setError(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
        setError(
          `Image dimensions (${img.width}x${img.height}) exceed maximum of ${MAX_DIMENSION}x${MAX_DIMENSION}.`,
        );
        URL.revokeObjectURL(url);
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setError("Failed to create canvas context");
        return;
      }
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, img.width, img.height);
      setImageData({
        rgba: new Uint8Array(data.data.buffer),
        width: img.width,
        height: img.height,
      });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setError("Failed to load image");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  const handleConvert = useCallback(async () => {
    if (!imageData) return;

    setIsConverting(true);
    setError(null);

    try {
      const wasm = await import("../wasm-pkg/stitch_studio_wasm.js");
      await wasm.default();

      const result = wasm.convert_image(
        imageData.rgba,
        imageData.width,
        imageData.height,
        gridWidth,
        gridHeight,
        maxColors,
      );

      if (!isGridData(result)) {
        setError("WASM returned invalid grid data");
        return;
      }
      onImport(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Conversion failed";
      setError(message);
    } finally {
      setIsConverting(false);
    }
  }, [imageData, gridWidth, gridHeight, maxColors, onImport]);

  return (
    <Modal onClose={onClose} minWidth={400} maxWidth={500}>
      <h2>Import Image</h2>

      <div style={{ marginBottom: 16 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileChange}
        />
      </div>

      {previewUrl && (
        <div style={{ marginBottom: 16 }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain" }}
          />
        </div>
      )}

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <label>
          Grid Width:
          <input
            type="number"
            value={gridWidth}
            onChange={(e) => setGridWidth(Number(e.target.value))}
            min={1}
            max={200}
            style={{ width: 60, marginLeft: 8 }}
          />
        </label>
        <label>
          Grid Height:
          <input
            type="number"
            value={gridHeight}
            onChange={(e) => setGridHeight(Number(e.target.value))}
            min={1}
            max={200}
            style={{ width: 60, marginLeft: 8 }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>
          Max Colors:
          <input
            type="number"
            value={maxColors}
            onChange={(e) => setMaxColors(Number(e.target.value))}
            min={2}
            max={64}
            style={{ width: 60, marginLeft: 8 }}
          />
        </label>
      </div>

      {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}

      <div className="modal-actions">
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={handleConvert}
          disabled={!imageData || isConverting}
        >
          {isConverting ? "Converting..." : "Convert"}
        </button>
      </div>
    </Modal>
  );
}
