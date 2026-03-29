/* tslint:disable */
/* eslint-disable */

/**
 * Convert raw RGBA pixel data to a cross-stitch grid.
 *
 * # Arguments
 * * `rgba_data` - Flat RGBA pixel array (4 bytes per pixel)
 * * `img_width` - Original image width in pixels
 * * `img_height` - Original image height in pixels
 * * `grid_width` - Desired grid width in stitches
 * * `grid_height` - Desired grid height in stitches
 * * `max_colors` - Maximum number of colors in the palette
 *
 * Returns a serialized `GridData` via `serde-wasm-bindgen`.
 */
export function convert_image(
  rgba_data: Uint8Array,
  img_width: number,
  img_height: number,
  grid_width: number,
  grid_height: number,
  max_colors: number,
): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly convert_image: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number,
    h: number,
  ) => void;
  readonly __wbindgen_export: (a: number, b: number) => number;
  readonly __wbindgen_export2: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?:
    | { module_or_path: InitInput | Promise<InitInput> }
    | InitInput
    | Promise<InitInput>,
): Promise<InitOutput>;
