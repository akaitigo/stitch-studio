use wasm_bindgen::prelude::*;

/// A single cell in the cross-stitch grid
#[derive(Clone, serde::Serialize, serde::Deserialize)]
pub struct GridCell {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

/// Result of image-to-grid conversion
#[derive(Clone, serde::Serialize, serde::Deserialize)]
pub struct GridData {
    pub width: u32,
    pub height: u32,
    pub cells: Vec<GridCell>,
    pub palette: Vec<GridCell>,
}

/// Compute squared Euclidean distance between two RGB colors
fn color_distance_sq(a: &GridCell, b: &GridCell) -> u32 {
    let dr = u32::from(a.r.abs_diff(b.r));
    let dg = u32::from(a.g.abs_diff(b.g));
    let db = u32::from(a.b.abs_diff(b.b));
    dr * dr + dg * dg + db * db
}

/// Find the index of the nearest color in the palette
fn nearest_palette_index(color: &GridCell, palette: &[GridCell]) -> usize {
    let mut best_idx = 0;
    let mut best_dist = u32::MAX;
    for (i, p) in palette.iter().enumerate() {
        let dist = color_distance_sq(color, p);
        if dist < best_dist {
            best_dist = dist;
            best_idx = i;
        }
    }
    best_idx
}

/// Median cut color quantization
///
/// Reduces a list of colors to at most `max_colors` representative colors.
fn median_cut(colors: &[GridCell], max_colors: usize) -> Vec<GridCell> {
    if colors.is_empty() {
        return vec![];
    }
    if max_colors <= 1 {
        return vec![average_color(colors)];
    }

    let mut buckets: Vec<Vec<GridCell>> = vec![colors.to_vec()];

    while buckets.len() < max_colors {
        // Find the bucket with the largest range to split
        let mut best_bucket = 0;
        let mut best_range = 0u32;
        for (i, bucket) in buckets.iter().enumerate() {
            let range = channel_range(bucket);
            if range > best_range {
                best_range = range;
                best_bucket = i;
            }
        }
        if best_range == 0 {
            break;
        }

        let bucket = buckets.remove(best_bucket);
        let (left, right) = split_bucket(&bucket);
        if !left.is_empty() {
            buckets.push(left);
        }
        if !right.is_empty() {
            buckets.push(right);
        }
    }

    buckets.iter().map(|b| average_color(b)).collect()
}

/// Get the maximum range across R, G, B channels
fn channel_range(colors: &[GridCell]) -> u32 {
    let (mut r_min, mut r_max) = (u8::MAX, u8::MIN);
    let (mut g_min, mut g_max) = (u8::MAX, u8::MIN);
    let (mut b_min, mut b_max) = (u8::MAX, u8::MIN);
    for c in colors {
        r_min = r_min.min(c.r);
        r_max = r_max.max(c.r);
        g_min = g_min.min(c.g);
        g_max = g_max.max(c.g);
        b_min = b_min.min(c.b);
        b_max = b_max.max(c.b);
    }
    let r_range = u32::from(r_max) - u32::from(r_min);
    let g_range = u32::from(g_max) - u32::from(g_min);
    let b_range = u32::from(b_max) - u32::from(b_min);
    r_range.max(g_range).max(b_range)
}

/// Determine which channel (0=R, 1=G, 2=B) has the widest range
fn widest_channel(colors: &[GridCell]) -> u8 {
    let (mut r_min, mut r_max) = (u8::MAX, u8::MIN);
    let (mut g_min, mut g_max) = (u8::MAX, u8::MIN);
    let (mut b_min, mut b_max) = (u8::MAX, u8::MIN);
    for c in colors {
        r_min = r_min.min(c.r);
        r_max = r_max.max(c.r);
        g_min = g_min.min(c.g);
        g_max = g_max.max(c.g);
        b_min = b_min.min(c.b);
        b_max = b_max.max(c.b);
    }
    let r_range = r_max - r_min;
    let g_range = g_max - g_min;
    let b_range = b_max - b_min;
    if r_range >= g_range && r_range >= b_range {
        0
    } else if g_range >= b_range {
        1
    } else {
        2
    }
}

fn split_bucket(colors: &[GridCell]) -> (Vec<GridCell>, Vec<GridCell>) {
    let ch = widest_channel(colors);
    let mut sorted = colors.to_vec();
    sorted.sort_by_key(|c| match ch {
        0 => c.r,
        1 => c.g,
        _ => c.b,
    });
    let mid = sorted.len() / 2;
    let left = sorted[..mid].to_vec();
    let right = sorted[mid..].to_vec();
    (left, right)
}

fn average_color(colors: &[GridCell]) -> GridCell {
    if colors.is_empty() {
        return GridCell { r: 0, g: 0, b: 0 };
    }
    let len = colors.len() as u64;
    let (mut r_sum, mut g_sum, mut b_sum) = (0u64, 0u64, 0u64);
    for c in colors {
        r_sum += u64::from(c.r);
        g_sum += u64::from(c.g);
        b_sum += u64::from(c.b);
    }
    GridCell {
        r: u8::try_from(r_sum / len).unwrap_or(0),
        g: u8::try_from(g_sum / len).unwrap_or(0),
        b: u8::try_from(b_sum / len).unwrap_or(0),
    }
}

/// Convert raw RGBA pixel data to a cross-stitch grid.
///
/// # Arguments
/// * `rgba_data` - Flat RGBA pixel array (4 bytes per pixel)
/// * `img_width` - Original image width in pixels
/// * `img_height` - Original image height in pixels
/// * `grid_width` - Desired grid width in stitches
/// * `grid_height` - Desired grid height in stitches
/// * `max_colors` - Maximum number of colors in the palette
///
/// Returns a serialized `GridData` via `serde-wasm-bindgen`.
#[wasm_bindgen]
pub fn convert_image(
    rgba_data: &[u8],
    img_width: u32,
    img_height: u32,
    grid_width: u32,
    grid_height: u32,
    max_colors: u32,
) -> Result<JsValue, JsValue> {
    let grid = convert_image_internal(rgba_data, img_width, img_height, grid_width, grid_height, max_colors)
        .map_err(JsValue::from_str)?;
    serde_wasm_bindgen::to_value(&grid).map_err(|e| JsValue::from_str(&e.to_string()))
}

/// Internal conversion logic (testable without wasm-bindgen)
fn convert_image_internal(
    rgba_data: &[u8],
    img_width: u32,
    img_height: u32,
    grid_width: u32,
    grid_height: u32,
    max_colors: u32,
) -> Result<GridData, &'static str> {
    if rgba_data.len() != (img_width as usize) * (img_height as usize) * 4 {
        return Err("Invalid RGBA data length");
    }
    if grid_width == 0 || grid_height == 0 {
        return Err("Grid dimensions must be positive");
    }

    // Step 1: Downsample image to grid size by averaging pixel blocks
    let mut sampled_colors: Vec<GridCell> = Vec::with_capacity((grid_width * grid_height) as usize);

    for gy in 0..grid_height {
        for gx in 0..grid_width {
            let x_start = (gx * img_width) / grid_width;
            let x_end = ((gx + 1) * img_width) / grid_width;
            let y_start = (gy * img_height) / grid_height;
            let y_end = ((gy + 1) * img_height) / grid_height;

            let mut r_sum = 0u64;
            let mut g_sum = 0u64;
            let mut b_sum = 0u64;
            let mut count = 0u64;

            for py in y_start..y_end {
                for px in x_start..x_end {
                    let idx = ((py * img_width + px) * 4) as usize;
                    let alpha = rgba_data[idx + 3];
                    // Skip transparent pixels (alpha < 128), treat as background
                    if alpha < 128 {
                        continue;
                    }
                    r_sum += u64::from(rgba_data[idx]);
                    g_sum += u64::from(rgba_data[idx + 1]);
                    b_sum += u64::from(rgba_data[idx + 2]);
                    count += 1;
                }
            }

            if count > 0 {
                sampled_colors.push(GridCell {
                    r: u8::try_from(r_sum / count).unwrap_or(0),
                    g: u8::try_from(g_sum / count).unwrap_or(0),
                    b: u8::try_from(b_sum / count).unwrap_or(0),
                });
            } else {
                // All pixels in this block are transparent -> white background
                sampled_colors.push(GridCell { r: 255, g: 255, b: 255 });
            }
        }
    }

    // Step 2: Color quantization via median cut
    let palette = median_cut(&sampled_colors, max_colors as usize);

    // Step 3: Map each cell to the nearest palette color
    let cells: Vec<GridCell> = sampled_colors
        .iter()
        .map(|c| {
            let idx = nearest_palette_index(c, &palette);
            palette[idx].clone()
        })
        .collect();

    Ok(GridData {
        width: grid_width,
        height: grid_height,
        cells,
        palette,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_color_distance() {
        let a = GridCell { r: 255, g: 0, b: 0 };
        let b = GridCell { r: 0, g: 255, b: 0 };
        let dist = color_distance_sq(&a, &b);
        assert_eq!(dist, 255 * 255 + 255 * 255);
    }

    #[test]
    fn test_nearest_palette_index() {
        let palette = vec![
            GridCell { r: 255, g: 0, b: 0 },
            GridCell { r: 0, g: 255, b: 0 },
            GridCell { r: 0, g: 0, b: 255 },
        ];
        let color = GridCell { r: 200, g: 30, b: 30 };
        assert_eq!(nearest_palette_index(&color, &palette), 0);
    }

    #[test]
    fn test_median_cut_single() {
        let colors = vec![GridCell { r: 100, g: 100, b: 100 }; 10];
        let result = median_cut(&colors, 1);
        assert_eq!(result.len(), 1);
        assert_eq!(result[0].r, 100);
    }

    #[test]
    fn test_median_cut_two_groups() {
        let mut colors = Vec::new();
        for _ in 0..50 {
            colors.push(GridCell { r: 200, g: 0, b: 0 });
        }
        for _ in 0..50 {
            colors.push(GridCell { r: 0, g: 0, b: 200 });
        }
        let result = median_cut(&colors, 2);
        assert_eq!(result.len(), 2);
    }

    #[test]
    fn test_convert_image_basic() {
        // 2x2 image -> 1x1 grid
        let rgba = vec![
            255, 0, 0, 255, // red
            0, 255, 0, 255, // green
            0, 0, 255, 255, // blue
            255, 255, 0, 255, // yellow
        ];
        let result = convert_image_internal(&rgba, 2, 2, 1, 1, 4);
        assert!(result.is_ok());
        let grid = result.ok();
        assert!(grid.is_some());
        let grid = grid.unwrap_or_else(|| GridData {
            width: 0,
            height: 0,
            cells: vec![],
            palette: vec![],
        });
        assert_eq!(grid.width, 1);
        assert_eq!(grid.height, 1);
        assert_eq!(grid.cells.len(), 1);
    }

    #[test]
    fn test_convert_image_invalid_data() {
        let rgba = vec![0u8; 10]; // wrong size
        let result = convert_image_internal(&rgba, 2, 2, 1, 1, 4);
        assert!(result.is_err());
    }

    #[test]
    fn test_convert_image_transparent_pixels_become_white() {
        // 2x1 image: one opaque red pixel, one fully transparent pixel
        let rgba = vec![
            255, 0, 0, 255, // red, opaque
            0, 0, 0, 0, // transparent
        ];
        let result = convert_image_internal(&rgba, 2, 1, 2, 1, 4);
        assert!(result.is_ok());
        let grid = result.ok().unwrap_or_else(|| GridData {
            width: 0,
            height: 0,
            cells: vec![],
            palette: vec![],
        });
        assert_eq!(grid.cells.len(), 2);
        // First cell: red
        assert_eq!(grid.cells[0].r, 255);
        assert_eq!(grid.cells[0].g, 0);
        assert_eq!(grid.cells[0].b, 0);
        // Second cell: white (transparent -> background)
        assert_eq!(grid.cells[1].r, 255);
        assert_eq!(grid.cells[1].g, 255);
        assert_eq!(grid.cells[1].b, 255);
    }

    #[test]
    fn test_convert_image_preserves_dimensions() {
        // 4x4 image -> 2x2 grid
        let rgba = vec![128u8; 4 * 4 * 4]; // 4x4 RGBA
        let result = convert_image_internal(&rgba, 4, 4, 2, 2, 4);
        assert!(result.is_ok());
        let grid = result.ok().unwrap_or_else(|| GridData {
            width: 0,
            height: 0,
            cells: vec![],
            palette: vec![],
        });
        assert_eq!(grid.width, 2);
        assert_eq!(grid.height, 2);
        assert_eq!(grid.cells.len(), 4);
    }
}
