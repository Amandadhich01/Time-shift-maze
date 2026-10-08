/**
 * Multi-Timeline Pathfinder & Solvability Checker (BFS over 4D State Space)
 * State: [r, c, era, collectedKeysBitmask]
 * 
 * Timeline 0 = Past
 * Timeline 1 = Future
 */

export function solveTimeMaze(mazePast, mazeFuture, startPos = [1, 1], requiredKeysTotal = null) {
  const ROWS = mazePast.length;
  const COLS = mazePast[0].length;

  // Locate all keys in both timelines
  const keyLocations = [];
  let exitPos = null;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (mazePast[r][c] === 2) {
        keyLocations.push({ r, c, era: 0, id: keyLocations.length });
      }
      if (mazeFuture[r][c] === 2) {
        keyLocations.push({ r, c, era: 1, id: keyLocations.length });
      }
      if (mazePast[r][c] === 3 || mazeFuture[r][c] === 3) {
        exitPos = { r, c };
      }
    }
  }

  const numKeys = requiredKeysTotal !== null ? Math.min(requiredKeysTotal, keyLocations.length) : keyLocations.length;
  const targetMask = (1 << numKeys) - 1;

  if (!exitPos) return { solvable: false, path: [] };

  // BFS Queue: [r, c, era, mask, parentIndex, action]
  const queue = [{
    r: startPos[0],
    c: startPos[1],
    era: 0,
    mask: 0,
    parent: -1,
    action: 'START'
  }];

  // Visited set: Set of strings "r,c,era,mask"
  const visited = new Set();
  visited.add(`${startPos[0]},${startPos[1]},0,0`);

  let goalNodeIndex = -1;
  const directions = [
    { dr: -1, dc: 0, action: 'UP' },
    { dr: 1, dc: 0, action: 'DOWN' },
    { dr: 0, dc: -1, action: 'LEFT' },
    { dr: 0, dc: 1, action: 'RIGHT' },
  ];

  let head = 0;
  const MAX_EXPLORATION = 80000;

  while (head < queue.length && head < MAX_EXPLORATION) {
    const current = queue[head];
    const { r, c, era, mask } = current;

    // Check if goal reached
    if (mask >= targetMask && r === exitPos.r && c === exitPos.c) {
      goalNodeIndex = head;
      break;
    }

    const currentMaze = era === 0 ? mazePast : mazeFuture;
    const otherMaze = era === 0 ? mazeFuture : mazePast;

    // 1. Try spatial movement (Up, Down, Left, Right)
    for (const dir of directions) {
      const nr = r + dir.dr;
      const nc = c + dir.dc;

      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        if (currentMaze[nr][nc] !== 1) { // 1 is wall
          let nextMask = mask;
          // Check if collecting key
          keyLocations.forEach(k => {
            if (k.era === era && k.r === nr && k.c === nc && k.id < numKeys) {
              nextMask |= (1 << k.id);
            }
          });

          const keyStr = `${nr},${nc},${era},${nextMask}`;
          if (!visited.has(keyStr)) {
            visited.add(keyStr);
            queue.push({
              r: nr,
              c: nc,
              era,
              mask: nextMask,
              parent: head,
              action: dir.action
            });
          }
        }
      }
    }

    // 2. Try temporal shift (Shift between Past and Future at current tile)
    const nextEra = 1 - era;
    if (otherMaze[r][c] !== 1) { // Other timeline tile must not be a solid wall
      let nextMask = mask;
      keyLocations.forEach(k => {
        if (k.era === nextEra && k.r === r && k.c === c && k.id < numKeys) {
          nextMask |= (1 << k.id);
        }
      });

      const keyStr = `${r},${c},${nextEra},${nextMask}`;
      if (!visited.has(keyStr)) {
        visited.add(keyStr);
        queue.push({
          r,
          c,
          era: nextEra,
          mask: nextMask,
          parent: head,
          action: 'TIME_SHIFT'
        });
      }
    }

    head++;
  }

  if (goalNodeIndex === -1) {
    return { solvable: false, path: [], totalSteps: 0 };
  }

  // Reconstruct path
  const path = [];
  let curr = goalNodeIndex;
  while (curr !== -1 && queue[curr].parent !== -1) {
    path.unshift({
      r: queue[curr].r,
      c: queue[curr].c,
      era: queue[curr].era,
      action: queue[curr].action
    });
    curr = queue[curr].parent;
  }

  return {
    solvable: true,
    path,
    totalSteps: path.length
  };
}
