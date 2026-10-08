import React from 'react';
import {
  Zap,
  Key,
  Compass,
  Volume2,
  VolumeX,
  RotateCcw,
  HelpCircle,
  Layers,
  Sparkles,
  AlertTriangle,
  Clock,
  Edit3
} from 'lucide-react';

export default function HUD({
  timeState,
  energy,
  keysCollected,
  requiredKeys,
  moves,
  elapsedTime,
  levelName,
  canShiftSafely,
  muted,
  onToggleMute,
  onResetLevel,
  onOpenLevelSelect,
  onOpenHelp,
  onToggleHint,
  showHint,
  onOpenEditor
}) {
  const isPast = timeState === 0;

  // Format elapsed time (MM:SS)
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        {/* Level Name & Era Status */}
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-lg border font-orbitron font-bold text-xs tracking-wider flex items-center gap-2 transition-all ${
            isPast
              ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
              : 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
          }`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isPast ? 'bg-amber-400' : 'bg-cyan-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isPast ? 'bg-amber-500' : 'bg-cyan-500'
              }`}></span>
            </span>
            {isPast ? 'ERA: PAST (ANCIENT RUINS)' : 'ERA: FUTURE (CYBER MATRIX)'}
          </div>

          <span className="text-sm font-semibold text-slate-300 hidden sm:inline">
            {levelName}
          </span>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Hint / AI Oracle */}
          <button
            onClick={onToggleHint}
            title="Temporal Oracle (AI Pathfinding Hint)"
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
              showHint
                ? 'bg-purple-600/30 border-purple-500 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-purple-500/50 hover:text-purple-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline">Oracle</span>
          </button>

          {/* Level Editor */}
          <button
            onClick={onOpenEditor}
            title="Custom Level Editor"
            className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-all flex items-center gap-1 text-xs font-semibold"
          >
            <Edit3 className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Editor</span>
          </button>

          {/* Level Select */}
          <button
            onClick={onOpenLevelSelect}
            title="Select Level / Mode"
            className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-all"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={onResetLevel}
            title="Restart Level"
            className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:border-amber-500/50 hover:text-amber-300 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Mute */}
          <button
            onClick={onToggleMute}
            title={muted ? 'Unmute' : 'Mute'}
            className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-all"
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Help */}
          <button
            onClick={onOpenHelp}
            title="Instructions"
            className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-all"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Chrono Energy */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <Zap className={`w-3.5 h-3.5 ${energy <= 20 ? 'text-red-400 animate-bounce' : 'text-yellow-400'}`} />
              Energy
            </span>
            <span className={`font-mono font-bold ${energy <= 20 ? 'text-red-400' : 'text-slate-200'}`}>
              {energy}%
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                energy > 50
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                  : energy > 20
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                  : 'bg-red-500 animate-pulse'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, energy))}%` }}
            />
          </div>
        </div>

        {/* Chrono Shards */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${keysCollected >= requiredKeys ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
              <Key className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Shards</div>
              <div className="font-orbitron font-bold text-sm text-slate-100">
                {keysCollected} / {requiredKeys}
              </div>
            </div>
          </div>
          {keysCollected >= requiredKeys && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/50 text-emerald-400">
              PORTAL READY
            </span>
          )}
        </div>

        {/* Moves Counter */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Moves</div>
            <div className="font-mono font-bold text-sm text-slate-100">{moves}</div>
          </div>
        </div>

        {/* Timer */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Time</div>
            <div className="font-mono font-bold text-sm text-slate-100">{formatTime(elapsedTime)}</div>
          </div>
        </div>
      </div>

      {/* Paradox Radar / Collision Warning */}
      {!canShiftSafely && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-semibold animate-pulse">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>PARADOX HAZARD: Wall obstructs alternate timeline at current coordinates! Step to clear tile before shifting.</span>
        </div>
      )}
    </div>
  );
}
