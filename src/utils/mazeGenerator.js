import { solveTimeMaze } from './mazeSolver';

/**
 * Tile Types:
 * 0: Empty / Walkable Corridor
 * 1: Wall (Ancient Stone in Past / Forcefield Wall in Future)
 * 2: Chrono Key / Shard (Required to unlock exit)
 * 3: Exit Portal / Chrono Gate
 * 4: Chrono Energy Capsule (+25 Energy)
 */

export function generateGuaranteedSolvableMaze(rows = 15, cols = 15, requiredKeys = 3, minShiftsRequired = 1) {
  // Ensure odd dimensions for classic maze corridor carving
  const rCount = rows % 2 === 0 ? rows + 1 : rows;
  const cCount = cols % 2 === 0 ? cols + 1 : cols;

  let attempts = 0;
  while (attempts < 50) {
    attempts++;
    const { mazePast, mazeFuture } = createDualMazeStructure(rCount, cCount, requiredKeys);
    
    // Test with solver
    const solution = solveTimeMaze(mazePast, mazeFuture, [1, 1], requiredKeys);
    if (solution.solvable) {
      // Check if the solution actually uses time shifts
      const shiftCount = solution.path.filter(p => p.action === 'TIME_SHIFT').length;
      if (shiftCount >= minShiftsRequired) {
        return {
          mazePast,
          mazeFuture,
          rows: rCount,
          cols: cCount,
          requiredKeys,
          solution
        };
      }
    }
  }

  // Fallback to handcrafted reliable procedural fallback
  return createFallbackTemporalMaze(rCount, cCount, requiredKeys);
}

function createDualMazeStructure(rows, cols, requiredKeys) {
  // Start with full walls
  const past = Array.from({ length: rows }, () => Array(cols).fill(1));
  const future = Array.from({ length: rows }, () => Array(cols).fill(1));

  // Carve base maze corridors using randomized DFS
  function carveMaze(grid) {
    const stack = [[1, 1]];
    grid[1][1] = 0;

    const dirs = [
      [-2, 0], [2, 0], [0, -2], [0, 2]
    ];

    while (stack.length > 0) {
      const [cr, cc] = stack[stack.length - 1];
      const neighbors = [];

      for (const [dr, dc] of dirs) {
        const nr = cr + dr;
        const nc = cc + dc;
        if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && grid[nr][nc] === 1) {
          neighbors.push([nr, nc, dr, dc]);
        }
      }

      if (neighbors.length > 0) {
        const [nr, nc, dr, dc] = neighbors[Math.floor(Math.random() * neighbors.length)];
        grid[cr + dr / 2][cc + dc / 2] = 0;
        grid[nr][nc] = 0;
        stack.push([nr, nc]);
      } else {
        stack.pop();
      }
    }
  }

  carveMaze(past);

  // Future is a temporal evolution:
  // Clone past, then open some walls (erosion over time) and block other corridors (future construction)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      future[r][c] = past[r][c];
    }
  }

  // Create temporal divergences
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if ((r === 1 && c === 1) || (r === rows - 2 && c === cols - 2)) continue;

      const roll = Math.random();
      if (past[r][c] === 1 && roll < 0.22) {
        // Wall in past crumbled over centuries into open passage in future
        future[r][c] = 0;
      } else if (past[r][c] === 0 && roll < 0.22) {
        // Open passage in past has futuristic laser barrier erected in future
        future[r][c] = 1;
      }
    }
  }

  // Ensure start is clear in both
  past[1][1] = 0;
  future[1][1] = 0;

  // Place Exit Portal at bottom-right
  const exitR = rows - 2;
  const exitC = cols - 2;
  past[exitR][exitC] = 3;
  future[exitR][exitC] = 3;
  // Ensure approach to exit is clear in at least one timeline
  past[exitR - 1][exitC] = 0;
  future[exitR][exitC - 1] = 0;

  // Distribute Keys (Split between Past and Future timelines)
  let placedKeys = 0;
  const openPast = [];
  const openFuture = [];

  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if ((r === 1 && c === 1) || (r === exitR && c === exitC)) continue;
      if (past[r][c] === 0) openPast.push([r, c]);
      if (future[r][c] === 0) openFuture.push([r, c]);
    }
  }

  // Shuffle
  openPast.sort(() => Math.random() - 0.5);
  openFuture.sort(() => Math.random() - 0.5);

  const keysForPast = Math.ceil(requiredKeys / 2);
  const keysForFuture = requiredKeys - keysForPast;

  for (let i = 0; i < keysForPast && i < openPast.length; i++) {
    const [r, c] = openPast[i];
    past[r][c] = 2; // Key
    placedKeys++;
  }

  for (let i = 0; i < keysForFuture && i < openFuture.length; i++) {
    const [r, c] = openFuture[i];
    // don't overwrite exit or start
    if (future[r][c] === 0) {
      future[r][c] = 2; // Key
      placedKeys++;
    }
  }

  // Add Energy Capsules (cell value 4)
  if (openPast.length > 5) {
    const [er1, ec1] = openPast[openPast.length - 1];
    if (past[er1][ec1] === 0) past[er1][ec1] = 4;
  }
  if (openFuture.length > 5) {
    const [er2, ec2] = openFuture[openFuture.length - 1];
    if (future[er2][ec2] === 0) future[er2][ec2] = 4;
  }

  return { mazePast: past, mazeFuture: future };
}

function createFallbackTemporalMaze(rows, cols, requiredKeys) {
  const past = Array.from({ length: rows }, () => Array(cols).fill(0));
  const future = Array.from({ length: rows }, () => Array(cols).fill(0));

  // Border walls
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
        past[r][c] = 1;
        future[r][c] = 1;
      }
    }
  }

  // Alternating temporal hurdles
  for (let r = 2; r < rows - 2; r += 2) {
    for (let c = 2; c < cols - 2; c++) {
      if (c % 2 === 0) {
        past[r][c] = 1;     // Blocked in past
        future[r][c] = 0;   // Open in future
      } else {
        past[r][c] = 0;     // Open in past
        future[r][c] = 1;   // Blocked in future
      }
    }
  }

  // Keys
  past[1][cols - 2] = 2;
  future[rows - 2][1] = 2;
  if (requiredKeys > 2) {
    past[Math.floor(rows / 2)][Math.floor(cols / 2)] = 2;
  }

  // Exit
  past[rows - 2][cols - 2] = 3;
  future[rows - 2][cols - 2] = 3;

  return {
    mazePast: past,
    mazeFuture: future,
    rows,
    cols,
    requiredKeys,
    solution: solveTimeMaze(past, future, [1, 1], requiredKeys)
  };
}
