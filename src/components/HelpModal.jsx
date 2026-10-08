import React from 'react';
import { X, HelpCircle, Zap, Key, DoorClosed, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xl p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-left space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-orbitron font-bold text-slate-100">
                TEMPORAL OPERATIVE MANUAL
              </h3>
              <p className="text-xs text-slate-400">How to conquer the Time-Shift Maze.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Premise */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <h4 className="text-xs font-orbitron font-bold text-cyan-400 tracking-wider">
            THE CHRONO PARADOX
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            You are a temporal operative trapped inside a dynamic quantum labyrinth that exists across two eras at once:
            the <span className="text-amber-400 font-semibold">Ancient Past</span> and the <span className="text-cyan-400 font-semibold">Cyber Future</span>.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Corridors blocked by impenetrable stone pillars in the Past may have crumbled into open walkways centuries later in the Future.
            Conversely, passages accessible in the Past might be severed by high-voltage laser forcefields in the Future!
          </p>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          <h4 className="text-xs font-orbitron font-bold text-slate-300 tracking-wider">
            TACTICAL RECON & ENTITIES
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-amber-600/30 border border-amber-500 flex items-center justify-center flex-shrink-0 text-amber-400 font-bold">
                1
              </div>
              <div>
                <div className="font-semibold text-slate-200">Ancient & Cyber Walls</div>
                <div className="text-slate-400 text-[11px]">Solid obstructions. Impassable in the current timeline.</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-yellow-500/30 border border-yellow-400 flex items-center justify-center flex-shrink-0 text-yellow-300 font-bold">
                <Key className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-semibold text-slate-200">Chrono Shards (Keys)</div>
                <div className="text-slate-400 text-[11px]">Collect all shards across both eras to unlock the Exit Portal.</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-emerald-500/30 border border-emerald-400 flex items-center justify-center flex-shrink-0 text-emerald-300 font-bold">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-semibold text-slate-200">Energy Capsules</div>
                <div className="text-slate-400 text-[11px]">Replenishes +25% Chrono Battery. Essential for extended shifts.</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-cyan-500/30 border border-cyan-400 flex items-center justify-center flex-shrink-0 text-cyan-300 font-bold">
                <DoorClosed className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-semibold text-slate-200">Chrono Gate (Exit Portal)</div>
                <div className="text-slate-400 text-[11px]">Reach this coordinate once all shards are collected to escape!</div>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Rules */}
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-orbitron font-bold">
            <AlertTriangle className="w-4 h-4" /> PARADOX COLLISION WARNING
          </div>
          <p className="text-slate-300 leading-relaxed">
            Each Time Shift consumes <strong>5% Chrono Energy</strong>. If a wall exists at your exact coordinates in the alternate timeline, shifting is blocked to avoid molecular fusion paradoxes! Look at the dashed warning indicators on the ground before warping.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-orbitron font-bold text-xs tracking-wider transition-all"
        >
          ACKNOWLEDGE & RESUME MISSION
        </button>
      </div>
    </div>
  );
}
