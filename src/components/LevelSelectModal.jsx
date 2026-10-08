import React, { useState } from 'react';
import { X, Play, Shuffle, Sparkles, CheckCircle2 } from 'lucide-react';
import { CAMPAIGN_LEVELS } from '../utils/levels';

export default function LevelSelectModal({
  isOpen,
  onClose,
  currentLevelId,
  onSelectCampaignLevel,
  onGenerateProcedural
}) {
  const [procSize, setProcSize] = useState(13);
  const [procKeys, setProcKeys] = useState(3);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-left space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-orbitron font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              CHRONO DISPATCH: LEVEL SELECT
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Select a campaign simulation or generate an infinite quantum labyrinth.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Campaign Levels */}
        <div className="space-y-3">
          <h4 className="text-xs font-orbitron font-bold text-cyan-400 tracking-wider">
            STORY CAMPAIGN PUZZLES
          </h4>
          <div className="space-y-2">
            {CAMPAIGN_LEVELS.map((lvl) => {
              const isActive = currentLevelId === lvl.id;
              return (
                <div
                  key={lvl.id}
                  onClick={() => {
                    onSelectCampaignLevel(lvl.id);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-orbitron font-bold text-sm text-slate-200">
                        {lvl.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-400">
                        {lvl.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {lvl.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <Play className="w-4 h-4 text-slate-500 hover:text-cyan-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Procedural Infinite Generator */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-orbitron font-bold text-amber-400 tracking-wider">
              QUANTUM GENERATOR (INFINITE MODE)
            </h4>
          </div>
          <p className="text-xs text-slate-400">
            Algorithmic maze with guaranteed multi-timeline solvability verified via 4D BFS pathfinder.
          </p>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Grid Dimension:</label>
              <select
                value={procSize}
                onChange={(e) => setProcSize(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-400"
              >
                <option value={9}>9 x 9 (Compact)</option>
                <option value={13}>13 x 13 (Standard)</option>
                <option value={17}>17 x 17 (Complex)</option>
                <option value={21}>21 x 21 (Hardcore Labyrinth)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Chrono Shards:</label>
              <select
                value={procKeys}
                onChange={(e) => setProcKeys(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-400"
              >
                <option value={2}>2 Shards</option>
                <option value={3}>3 Shards</option>
                <option value={4}>4 Shards</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              onGenerateProcedural(procSize, procKeys);
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-orbitron font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
          >
            <Shuffle className="w-4 h-4" /> GENERATE SOLVABLE MAZE
          </button>
        </div>
      </div>
    </div>
  );
}
