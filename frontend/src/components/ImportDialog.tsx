import { useState, useCallback, useRef } from "react";
import type { GridData } from "../types/grid";

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

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError(null);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
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
    },
    [],
  );

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

      onImport(result as GridData);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Conversion failed";
      setError(message);
    } finally {
      setIsConverting(false);
    }
  }, [imageData, gridWidth, gridHeight, maxColors, onImport]);

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 24,
          minWidth: 400,
          maxWidth: 500,
        }}
      >
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

        {error && (
          <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConvert}
            disabled={!imageData || isConverting}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: 4,
              cursor: imageData && !isConverting ? "pointer" : "not-allowed",
            }}
          >
            {isConverting ? "Converting..." : "Convert"}
          </button>
        </div>
      </div>
    </div>
  );
}
