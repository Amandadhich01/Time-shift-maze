import React, { useState } from 'react';
import { X, Play, Copy, Check, Download, Upload, Paintbrush, Layers } from 'lucide-react';
import { solveTimeMaze } from '../utils/mazeSolver';

export default function LevelEditor({ isOpen, onClose, onPlayCustomLevel }) {
  const [size, setSize] = useState(9);
  const [activeEra, setActiveEra] = useState(0); // 0 = Past, 1 = Future
  const [brush, setBrush] = useState(1); // 0: Empty, 1: Wall, 2: Key, 3: Exit, 4: Energy
  const [copied, setCopied] = useState(false);
  const [solvabilityStatus, setSolvabilityStatus] = useState(null);

  // Initialize empty grids
  const [pastGrid, setPastGrid] = useState(() => {
    const g = Array.from({ length: 9 }, () => Array(9).fill(0));
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (r === 0 || r === 8 || c === 0 || c === 8) g[r][c] = 1;
      }
    }
    g[8 - 1][8 - 1] = 3;
    g[1][7] = 2;
    return g;
  });

  const [futureGrid, setFutureGrid] = useState(() => {
    const g = Array.from({ length: 9 }, () => Array(9).fill(0));
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (r === 0 || r === 8 || c === 0 || c === 8) g[r][c] = 1;
      }
    }
    g[8 - 1][8 - 1] = 3;
    g[7][1] = 2;
    return g;
  });

  if (!isOpen) return null;

  const currentGrid = activeEra === 0 ? pastGrid : futureGrid;
  const setCurrentGrid = (newGrid) => {
    if (activeEra === 0) setPastGrid(newGrid);
    else setFutureGrid(newGrid);
  };

  const handleCellClick = (r, c) => {
    if ((r === 1 && c === 1) || (r === 0 || r === size - 1 || c === 0 || c === size - 1)) {
      // Don't modify outer boundaries or spawn
      return;
    }
    const next = currentGrid.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? brush : cell))
    );
    setCurrentGrid(next);
    setSolvabilityStatus(null);
  };

  const handleVerify = () => {
    const result = solveTimeMaze(pastGrid, futureGrid, [1, 1]);
    setSolvabilityStatus(result);
  };

  const handlePlay = () => {
    const result = solveTimeMaze(pastGrid, futureGrid, [1, 1]);
    if (!result.solvable) {
      alert("Notice: This maze currently has no valid path to collect all shards and reach the exit portal! Try adjusting walls or shard placements.");
      return;
    }

    // Count keys
    let keysCount = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (pastGrid[r][c] === 2) keysCount++;
        if (futureGrid[r][c] === 2) keysCount++;
      }
    }

    onPlayCustomLevel({
      id: 999,
      name: "Custom Quantum Forge Puzzle",
      difficulty: "Custom",
      description: "Designed in the interactive Time-Shift Matrix Editor.",
      rows: size,
      cols: size,
      initialEnergy: 100,
      requiredKeys: Math.max(1, keysCount),
      mazePast: pastGrid,
      mazeFuture: futureGrid
    });
    onClose();
  };

  const handleExport = () => {
    const data = JSON.stringify({ size, past: pastGrid, future: futureGrid }, null, 2);
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-left space-y-5 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Paintbrush className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-orbitron font-bold text-slate-100">
                TEMPORAL ARCHITECT (LEVEL EDITOR)
              </h3>
              <p className="text-xs text-slate-400">Design custom parallel realities and test paradox paths.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Timeline Selector & Brushes */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
          {/* Era Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">EDITING ERA:</span>
            <div className="flex rounded-lg overflow-hidden border border-slate-700">
              <button
                onClick={() => setActiveEra(0)}
                className={`px-3 py-1.5 text-xs font-orbitron font-bold transition-all ${
                  activeEra === 0
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                PAST
              </button>
              <button
                onClick={() => setActiveEra(1)}
                className={`px-3 py-1.5 text-xs font-orbitron font-bold transition-all ${
                  activeEra === 1
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                FUTURE
              </button>
            </div>
          </div>

          {/* Brush Selector */}
          <div className="flex items-center gap-1.5">
            {[
              { val: 0, label: 'Floor', color: 'bg-slate-800 text-slate-300' },
              { val: 1, label: 'Wall', color: activeEra === 0 ? 'bg-amber-600 text-white' : 'bg-cyan-600 text-white' },
              { val: 2, label: 'Shard', color: 'bg-yellow-500 text-slate-950' },
              { val: 4, label: 'Energy', color: 'bg-emerald-500 text-slate-950' },
              { val: 3, label: 'Exit', color: 'bg-indigo-500 text-white' }
            ].map((b) => (
              <button
                key={b.val}
                onClick={() => setBrush(b.val)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  brush === b.val
                    ? `${b.color} border-white shadow-md scale-105`
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Grid Canvas */}
        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div
            className="grid gap-1 select-none"
            style={{
              gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
              width: `${size * 36}px`
            }}
          >
            {currentGrid.map((row, r) =>
              row.map((cell, c) => {
                const isStart = r === 1 && c === 1;
                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all border ${
                      cell === 1
                        ? activeEra === 0
                          ? 'bg-amber-900 border-amber-700 text-amber-200'
                          : 'bg-cyan-950 border-cyan-500 text-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                        : cell === 2
                        ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                        : cell === 3
                        ? 'bg-indigo-500/30 border-indigo-500 text-indigo-300'
                        : cell === 4
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isStart ? '🚀' : cell === 1 ? '■' : cell === 2 ? '💎' : cell === 3 ? '🚪' : cell === 4 ? '⚡' : ''}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Solver Verification Banner */}
        {solvabilityStatus && (
          <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
            solvabilityStatus.solvable
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
          }`}>
            <span>
              {solvabilityStatus.solvable
                ? `✓ SOLVABLE! Shortest multi-timeline path requires ${solvabilityStatus.totalSteps} steps.`
                : '✕ UNBEATABLE: No valid temporal path to collect shards and reach exit!'}
            </span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleVerify}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold"
            >
              Check Solvability
            </button>
            <button
              onClick={handleExport}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied JSON!' : 'Copy Code'}
            </button>
          </div>

          <button
            onClick={handlePlay}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-orbitron font-bold text-xs tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/30"
          >
            <Play className="w-4 h-4" /> PLAY CUSTOM LEVEL
          </button>
        </div>
      </div>
    </div>
  );
}
