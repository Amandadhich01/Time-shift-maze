import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export default function Controls({ onMove, onShift, canShiftSafely, timeState, energy }) {
  const isPast = timeState === 0;

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
      {/* Keyboard guide / Quick legend */}
      <div className="text-xs text-slate-400 space-y-1 text-center sm:text-left">
        <div className="font-semibold text-slate-300">KEYBOARD SHORTCUTS:</div>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px]">W / ↑</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px]">A / ←</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px]">S / ↓</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px]">D / →</kbd>
          <span className="text-slate-500">to Move</span>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-1.5">
          <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-[11px]">SPACEBAR</kbd>
          <span className="text-slate-500">to Shift Era (-5 Energy)</span>
        </div>
      </div>

      {/* Main Touch / Click Interaction Controls */}
      <div className="flex items-center gap-6">
        {/* On-Screen D-Pad for Touch/Mobile */}
        <div className="grid grid-cols-3 gap-1.5 w-32 h-32 items-center justify-center">
          <div />
          <button
            onClick={() => onMove(-1, 0)}
            className="w-10 h-10 rounded-lg bg-slate-800/90 active:bg-cyan-600 border border-slate-700 flex items-center justify-center text-slate-200 active:scale-95 shadow transition-all"
            aria-label="Move Up"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <div />

          <button
            onClick={() => onMove(0, -1)}
            className="w-10 h-10 rounded-lg bg-slate-800/90 active:bg-cyan-600 border border-slate-700 flex items-center justify-center text-slate-200 active:scale-95 shadow transition-all"
            aria-label="Move Left"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-700/50" />
          </div>
          <button
            onClick={() => onMove(0, 1)}
            className="w-10 h-10 rounded-lg bg-slate-800/90 active:bg-cyan-600 border border-slate-700 flex items-center justify-center text-slate-200 active:scale-95 shadow transition-all"
            aria-label="Move Right"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <div />
          <button
            onClick={() => onMove(1, 0)}
            className="w-10 h-10 rounded-lg bg-slate-800/90 active:bg-cyan-600 border border-slate-700 flex items-center justify-center text-slate-200 active:scale-95 shadow transition-all"
            aria-label="Move Down"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <div />
        </div>

        {/* Big Futuristic Time Shift Trigger */}
        <button
          onClick={onShift}
          disabled={energy < 5}
          className={`relative px-5 py-3.5 rounded-xl border font-orbitron font-bold text-xs tracking-wider flex flex-col items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
            isPast
              ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 border-amber-300 shadow-amber-500/30'
              : 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 border-cyan-300 shadow-cyan-500/30'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 animate-spin [animation-duration:8s]" />
            <span>TIME SHIFT</span>
          </div>
          <span className="text-[10px] font-mono opacity-80">
            {isPast ? 'WARP TO FUTURE' : 'WARP TO PAST'}
          </span>
        </button>
      </div>
    </div>
  );
}
