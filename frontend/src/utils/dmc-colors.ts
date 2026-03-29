import type { Color } from "../types/grid";

export interface DmcThread {
  code: string;
  name: string;
  color: Color;
}

/** DMC thread color database (subset of most common colors) */
export const DMC_THREADS: DmcThread[] = [
  { code: "310", name: "Black", color: { r: 0, g: 0, b: 0 } },
  { code: "White", name: "White", color: { r: 255, g: 255, b: 255 } },
  { code: "321", name: "Red", color: { r: 199, g: 43, b: 59 } },
  { code: "349", name: "Dk Coral", color: { r: 210, g: 69, b: 69 } },
  { code: "350", name: "Md Coral", color: { r: 224, g: 95, b: 85 } },
  { code: "498", name: "Dk Red", color: { r: 167, g: 19, b: 43 } },
  { code: "666", name: "Bright Red", color: { r: 227, g: 29, b: 34 } },
  { code: "304", name: "Md Red", color: { r: 183, g: 31, b: 51 } },
  { code: "815", name: "Md Garnet", color: { r: 135, g: 7, b: 43 } },
  { code: "816", name: "Garnet", color: { r: 151, g: 11, b: 35 } },
  { code: "150", name: "Dusty Rose Ult Dk", color: { r: 171, g: 2, b: 73 } },
  { code: "307", name: "Lemon", color: { r: 253, g: 237, b: 84 } },
  { code: "444", name: "Dk Lemon", color: { r: 255, g: 214, b: 0 } },
  { code: "972", name: "Deep Canary", color: { r: 255, g: 181, b: 21 } },
  { code: "740", name: "Tangerine", color: { r: 255, g: 131, b: 19 } },
  { code: "741", name: "Md Tangerine", color: { r: 255, g: 163, b: 43 } },
  { code: "742", name: "Lt Tangerine", color: { r: 255, g: 191, b: 87 } },
  { code: "970", name: "Pumpkin Lt", color: { r: 247, g: 139, b: 19 } },
  { code: "946", name: "Md Burnt Orange", color: { r: 235, g: 99, b: 7 } },
  { code: "608", name: "Bright Orange", color: { r: 253, g: 93, b: 53 } },
  { code: "700", name: "Bright Green", color: { r: 7, g: 115, b: 27 } },
  { code: "701", name: "Lt Green", color: { r: 63, g: 143, b: 41 } },
  { code: "702", name: "Kelly Green", color: { r: 71, g: 167, b: 47 } },
  { code: "703", name: "Chartreuse", color: { r: 123, g: 181, b: 71 } },
  { code: "704", name: "Bright Chartreuse", color: { r: 158, g: 207, b: 52 } },
  { code: "699", name: "Christmas Green", color: { r: 5, g: 101, b: 23 } },
  { code: "905", name: "Dk Parrot Green", color: { r: 109, g: 135, b: 35 } },
  { code: "906", name: "Md Parrot Green", color: { r: 127, g: 179, b: 53 } },
  { code: "907", name: "Lt Parrot Green", color: { r: 199, g: 230, b: 102 } },
  { code: "797", name: "Royal Blue", color: { r: 19, g: 71, b: 125 } },
  { code: "798", name: "Dk Delft Blue", color: { r: 70, g: 106, b: 142 } },
  { code: "799", name: "Md Delft Blue", color: { r: 116, g: 142, b: 182 } },
  { code: "800", name: "Pale Delft Blue", color: { r: 192, g: 204, b: 222 } },
  { code: "796", name: "Dk Royal Blue", color: { r: 17, g: 65, b: 109 } },
  { code: "820", name: "Vy Dk Royal Blue", color: { r: 14, g: 54, b: 92 } },
  { code: "995", name: "Electric Blue Dk", color: { r: 38, g: 150, b: 182 } },
  { code: "996", name: "Electric Blue Md", color: { r: 48, g: 194, b: 236 } },
  { code: "550", name: "Vy Dk Violet", color: { r: 92, g: 24, b: 78 } },
  { code: "552", name: "Md Violet", color: { r: 128, g: 58, b: 132 } },
  { code: "553", name: "Violet", color: { r: 163, g: 99, b: 162 } },
  { code: "554", name: "Lt Violet", color: { r: 219, g: 179, b: 203 } },
  { code: "718", name: "Plum", color: { r: 156, g: 36, b: 98 } },
  { code: "917", name: "Md Plum", color: { r: 155, g: 19, b: 89 } },
  { code: "3607", name: "Lt Plum", color: { r: 197, g: 73, b: 137 } },
  { code: "3608", name: "Vy Lt Plum", color: { r: 234, g: 156, b: 196 } },
  { code: "415", name: "Pearl Gray", color: { r: 211, g: 211, b: 214 } },
  { code: "414", name: "Dk Steel Gray", color: { r: 167, g: 167, b: 167 } },
  { code: "317", name: "Pewter Gray", color: { r: 108, g: 108, b: 108 } },
  { code: "413", name: "Dk Pewter Gray", color: { r: 86, g: 86, b: 86 } },
  { code: "3799", name: "Vy Dk Pewter Gray", color: { r: 66, g: 66, b: 66 } },
  { code: "838", name: "Vy Dk Beige Brown", color: { r: 89, g: 73, b: 55 } },
  { code: "839", name: "Dk Beige Brown", color: { r: 103, g: 85, b: 65 } },
  { code: "840", name: "Md Beige Brown", color: { r: 154, g: 124, b: 92 } },
  { code: "841", name: "Lt Beige Brown", color: { r: 182, g: 155, b: 126 } },
  { code: "842", name: "Vy Lt Beige Brown", color: { r: 209, g: 186, b: 161 } },
  { code: "3371", name: "Black Brown", color: { r: 30, g: 17, b: 8 } },
  { code: "433", name: "Md Brown", color: { r: 122, g: 69, b: 31 } },
  { code: "434", name: "Lt Brown", color: { r: 152, g: 94, b: 51 } },
  { code: "435", name: "Vy Lt Brown", color: { r: 184, g: 119, b: 72 } },
  { code: "436", name: "Tan", color: { r: 203, g: 144, b: 81 } },
  { code: "437", name: "Lt Tan", color: { r: 228, g: 187, b: 142 } },
  { code: "738", name: "Vy Lt Tan", color: { r: 236, g: 204, b: 158 } },
  { code: "948", name: "Vy Lt Peach", color: { r: 254, g: 231, b: 218 } },
  { code: "754", name: "Lt Peach", color: { r: 247, g: 203, b: 191 } },
  { code: "353", name: "Peach", color: { r: 254, g: 175, b: 168 } },
  { code: "352", name: "Coral", color: { r: 253, g: 156, b: 151 } },
  { code: "351", name: "Dk Coral", color: { r: 233, g: 106, b: 103 } },
  { code: "818", name: "Baby Pink", color: { r: 255, g: 223, b: 217 } },
  { code: "776", name: "Md Pink", color: { r: 252, g: 176, b: 185 } },
  { code: "899", name: "Md Rose", color: { r: 242, g: 118, b: 136 } },
  { code: "335", name: "Rose", color: { r: 238, g: 84, b: 110 } },
  { code: "326", name: "Vy Dk Rose", color: { r: 179, g: 59, b: 75 } },
];

/**
 * Compute squared Euclidean distance between two colors.
 * Used for finding the nearest DMC match.
 */
export function colorDistanceSq(a: Color, b: Color): number {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return dr * dr + dg * dg + db * db;
}

/** Find the nearest DMC thread for a given RGB color */
export function findNearestDmc(color: Color): DmcThread {
  let bestThread = DMC_THREADS[0];
  let bestDist = Number.MAX_SAFE_INTEGER;
  for (const thread of DMC_THREADS) {
    const dist = colorDistanceSq(color, thread.color);
    if (dist < bestDist) {
      bestDist = dist;
      bestThread = thread;
    }
  }
  return bestThread;
}

/**
 * Calculate the number of skeins needed for a given number of stitches.
 * Assumption: 1 skein of DMC (8m) covers approximately 400 full cross-stitches on 14-count Aida.
 */
export function calculateSkeins(stitchCount: number): number {
  const STITCHES_PER_SKEIN = 400;
  return Math.ceil(stitchCount / STITCHES_PER_SKEIN);
}

/** Thread usage information for the shopping list */
export interface ThreadUsage {
  thread: DmcThread;
  stitchCount: number;
  skeins: number;
}

/** Generate a shopping list from grid data */
export function generateShoppingList(cells: Color[]): ThreadUsage[] {
  // Step 1: Count by RGB
  const colorCounts = new Map<string, { color: Color; count: number }>();

  for (const cell of cells) {
    const key = `${cell.r}-${cell.g}-${cell.b}`;
    const existing = colorCounts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      colorCounts.set(key, { color: cell, count: 1 });
    }
  }

  // Step 2: Map to DMC and aggregate by DMC code
  const dmcCounts = new Map<string, { thread: DmcThread; count: number }>();
  for (const { color, count } of colorCounts.values()) {
    // Skip white/background cells (all 255)
    if (color.r === 255 && color.g === 255 && color.b === 255) {
      continue;
    }
    const thread = findNearestDmc(color);
    const existing = dmcCounts.get(thread.code);
    if (existing) {
      existing.count += count;
    } else {
      dmcCounts.set(thread.code, { thread, count });
    }
  }

  // Step 3: Build usage list
  const usages: ThreadUsage[] = [];
  for (const { thread, count } of dmcCounts.values()) {
    usages.push({
      thread,
      stitchCount: count,
      skeins: calculateSkeins(count),
    });
  }

  usages.sort((a, b) => b.stitchCount - a.stitchCount);
  return usages;
}
