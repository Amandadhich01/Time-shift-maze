import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, ArrowRight, RotateCcw, Clock, Compass, Zap } from 'lucide-react';

export default function VictoryModal({
  isOpen,
  levelName,
  moves,
  elapsedTime,
  energy,
  onNextLevel,
  onReplay,
  hasNextLevel
}) {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Star rating calculation based on energy and moves
  let stars = 1;
  if (energy >= 40) stars = 2;
  if (energy >= 70) stars = 3;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-center space-y-6">
        {/* Header Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-cyan-500 p-0.5 shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Trophy className="w-10 h-10 text-yellow-400 animate-pulse" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-orbitron font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400">
            CHRONO GATE REACHED!
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Timeline paradox resolved successfully in {levelName}.
          </p>
        </div>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-7 h-7 transition-all ${
                starIdx <= stars
                  ? 'text-yellow-400 fill-yellow-400 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" /> Time
            </div>
            <div className="font-mono font-bold text-slate-200">{formatTime(elapsedTime)}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-slate-400">
              <Compass className="w-3.5 h-3.5" /> Moves
            </div>
            <div className="font-mono font-bold text-slate-200">{moves}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-slate-400">
              <Zap className="w-3.5 h-3.5 text-yellow-400" /> Energy
            </div>
            <div className="font-mono font-bold text-yellow-400">{energy}%</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReplay}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Replay
          </button>

          {hasNextLevel ? (
            <button
              onClick={onNextLevel}
              className="flex-1 py-3 px-4 rounded-xl border border-cyan-400 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-orbitron font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition-all"
            >
              Next Level <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onReplay}
              className="flex-1 py-3 px-4 rounded-xl border border-amber-400 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-orbitron font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              Play Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
