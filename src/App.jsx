import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import Controls from './components/Controls';
import VictoryModal from './components/VictoryModal';
import LevelSelectModal from './components/LevelSelectModal';
import HelpModal from './components/HelpModal';
import LevelEditor from './components/LevelEditor';
import { CAMPAIGN_LEVELS } from './utils/levels';
import { generateGuaranteedSolvableMaze } from './utils/mazeGenerator';
import { solveTimeMaze } from './utils/mazeSolver';
import { soundManager } from './audio/soundManager';
import { Hourglass, Github, ShieldAlert, Sparkles } from 'lucide-react';

export default function App() {
  // Current active level configuration
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [levelData, setLevelData] = useState(() => CAMPAIGN_LEVELS[0]);

  // Maze matrices (cloned so items can be consumed)
  const [mazePast, setMazePast] = useState(() =>
    CAMPAIGN_LEVELS[0].mazePast.map(row => [...row])
  );
  const [mazeFuture, setMazeFuture] = useState(() =>
    CAMPAIGN_LEVELS[0].mazeFuture.map(row => [...row])
  );

  // Gameplay state
  const [playerPos, setPlayerPos] = useState([1, 1]);
  const [timeState, setTimeState] = useState(0); // 0 = Past, 1 = Future
  const [energy, setEnergy] = useState(100);
  const [keysCollected, setKeysCollected] = useState(0);
  const [moves, setMoves] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isWarping, setIsWarping] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintPath, setHintPath] = useState([]);

  // Modals state
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const timerRef = useRef(null);

  // Initialize/Load a level
  const loadLevel = useCallback((lvlConfig) => {
    setLevelData(lvlConfig);
    setMazePast(lvlConfig.mazePast.map(row => [...row]));
    setMazeFuture(lvlConfig.mazeFuture.map(row => [...row]));
    setPlayerPos([1, 1]);
    setTimeState(0);
    setEnergy(lvlConfig.initialEnergy || 100);
    setKeysCollected(0);
    setMoves(0);
    setElapsedTime(0);
    setIsVictory(false);
    setShowHint(false);
    setHintPath([]);
  }, []);

  // Timer interval
  useEffect(() => {
    if (!isVictory) {
      timerRef.current = setInterval(() => {
        setElapsedTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isVictory]);

  // Current and Alternate Maze
  const currentMaze = timeState === 0 ? mazePast : mazeFuture;
  const otherMaze = timeState === 0 ? mazeFuture : mazePast;

  // Check if player can shift safely right now
  const canShiftSafely = otherMaze[playerPos[0]]?.[playerPos[1]] !== 1;

  // Move handler
  const handleMove = useCallback((dr, dc) => {
    if (isVictory) return;

    const [r, c] = playerPos;
    const nr = r + dr;
    const nc = c + dc;

    const rows = currentMaze.length;
    const cols = currentMaze[0].length;

    // Boundary check
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return;

    // Wall collision
    if (currentMaze[nr][nc] === 1) {
      soundManager.playParadox();
      return;
    }

    // Step sound
    soundManager.playMove();
    setPlayerPos([nr, nc]);
    setMoves(m => m + 1);

    // Turn off hint on movement to keep focus
    if (showHint) setShowHint(false);

    // Check Tile Interactivity
    const tile = currentMaze[nr][nc];

    // Key collected (Shard)
    if (tile === 2) {
      soundManager.playKey();
      setKeysCollected(k => k + 1);
      // Remove key from matrix
      if (timeState === 0) {
        setMazePast(prev => prev.map((row, ri) => row.map((cell, ci) => ri === nr && ci === nc ? 0 : cell)));
      } else {
        setMazeFuture(prev => prev.map((row, ri) => row.map((cell, ci) => ri === nr && ci === nc ? 0 : cell)));
      }
    }

    // Energy Capsule collected (+25)
    if (tile === 4) {
      soundManager.playEnergy();
      setEnergy(e => Math.min(100, e + 25));
      if (timeState === 0) {
        setMazePast(prev => prev.map((row, ri) => row.map((cell, ci) => ri === nr && ci === nc ? 0 : cell)));
      } else {
        setMazeFuture(prev => prev.map((row, ri) => row.map((cell, ci) => ri === nr && ci === nc ? 0 : cell)));
      }
    }

    // Exit reached (3)
    if (tile === 3) {
      const keysNeeded = levelData.requiredKeys;
      const currentKeys = keysCollected + (tile === 2 ? 1 : 0);
      if (currentKeys >= keysNeeded) {
        soundManager.playVictory();
        setIsVictory(true);
      }
    }
  }, [currentMaze, isVictory, keysCollected, levelData.requiredKeys, playerPos, showHint, timeState]);

  // Time Shift handler
  const handleShift = useCallback(() => {
    if (isVictory) return;

    // Energy check
    if (energy < 5) {
      soundManager.playParadox();
      return;
    }

    // Paradox Collision check: Is the tile in the other era a wall?
    if (!canShiftSafely) {
      soundManager.playParadox();
      return;
    }

    // Execute Time Warp
    const nextState = 1 - timeState;
    soundManager.playShift(nextState);
    setTimeState(nextState);
    setEnergy(e => Math.max(0, e - 5));
    setIsWarping(true);
    setTimeout(() => setIsWarping(false), 350);

    // Turn off hint
    if (showHint) setShowHint(false);

    // Check if player landed on an item immediately upon shifting
    const tileOnOtherSide = otherMaze[playerPos[0]][playerPos[1]];
    if (tileOnOtherSide === 2) {
      soundManager.playKey();
      setKeysCollected(k => k + 1);
      if (nextState === 0) {
        setMazePast(prev => prev.map((row, ri) => row.map((cell, ci) => ri === playerPos[0] && ci === playerPos[1] ? 0 : cell)));
      } else {
        setMazeFuture(prev => prev.map((row, ri) => row.map((cell, ci) => ri === playerPos[0] && ci === playerPos[1] ? 0 : cell)));
      }
    } else if (tileOnOtherSide === 4) {
      soundManager.playEnergy();
      setEnergy(e => Math.min(100, e + 25));
      if (nextState === 0) {
        setMazePast(prev => prev.map((row, ri) => row.map((cell, ci) => ri === playerPos[0] && ci === playerPos[1] ? 0 : cell)));
      } else {
        setMazeFuture(prev => prev.map((row, ri) => row.map((cell, ci) => ri === playerPos[0] && ci === playerPos[1] ? 0 : cell)));
      }
    } else if (tileOnOtherSide === 3 && keysCollected >= levelData.requiredKeys) {
      soundManager.playVictory();
      setIsVictory(true);
    }
  }, [canShiftSafely, energy, isVictory, keysCollected, levelData.requiredKeys, otherMaze, playerPos, showHint, timeState]);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if inside an input or modal is open
      if (isHelpOpen || isLevelSelectOpen || isEditorOpen) return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        handleMove(-1, 0);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleMove(1, 0);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleMove(0, -1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleMove(0, 1);
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleShift();
      } else if (e.key === 'r' || e.key === 'R') {
        loadLevel(levelData);
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, handleShift, isEditorOpen, isHelpOpen, isLevelSelectOpen, levelData, loadLevel]);

  // AI Oracle Hint Solver
  const handleToggleHint = () => {
    if (showHint) {
      setShowHint(false);
      return;
    }
    const solution = solveTimeMaze(mazePast, mazeFuture, playerPos, levelData.requiredKeys);
    if (solution.solvable && solution.path.length > 0) {
      setHintPath(solution.path);
      setShowHint(true);
      soundManager.playKey();
    } else {
      soundManager.playParadox();
    }
  };

  // Mute toggle
  const toggleMute = () => {
    setMuted(m => {
      const next = !m;
      soundManager.setMuted(next);
      return next;
    });
  };

  // Campaign progression
  const handleNextLevel = () => {
    if (currentLevelIndex + 1 < CAMPAIGN_LEVELS.length) {
      const nextIdx = currentLevelIndex + 1;
      setCurrentLevelIndex(nextIdx);
      loadLevel(CAMPAIGN_LEVELS[nextIdx]);
    } else {
      // Re-trigger procedural mode if all campaign levels finished
      handleGenerateProcedural(13, 3);
    }
  };

  const handleSelectCampaign = (lvlId) => {
    const idx = CAMPAIGN_LEVELS.findIndex(l => l.id === lvlId);
    if (idx !== -1) {
      setCurrentLevelIndex(idx);
      loadLevel(CAMPAIGN_LEVELS[idx]);
    }
  };

  const handleGenerateProcedural = (size, keys) => {
    const generated = generateGuaranteedSolvableMaze(size, size, keys, 1);
    const customConfig = {
      id: 500,
      name: `Quantum Simulation (${size}x${size})`,
      difficulty: "Procedural",
      description: "Dynamically woven temporal maze verified 100% solvable.",
      rows: generated.rows,
      cols: generated.cols,
      initialEnergy: 100,
      requiredKeys: keys,
      mazePast: generated.mazePast,
      mazeFuture: generated.mazeFuture
    };
    setCurrentLevelIndex(-1);
    loadLevel(customConfig);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-3 sm:p-6 select-none scanlines font-rajdhani">
      {/* Navbar */}
      <header className="w-full max-w-4xl flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-cyan-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
              <Hourglass className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-orbitron font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cyan-300 to-cyan-500">
              TIME-SHIFT MAZE
            </h1>
            <p className="text-[11px] font-mono text-slate-400 tracking-wide">
              QUANTUM TEMPORAL LABYRINTH // v2.0
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/Amandadhich01/Time-shift-maze"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>

      {/* Main Game Arena */}
      <main className="w-full max-w-4xl flex flex-col items-center gap-4 my-auto py-2">
        {/* HUD Display */}
        <HUD
          timeState={timeState}
          energy={energy}
          keysCollected={keysCollected}
          requiredKeys={levelData.requiredKeys}
          moves={moves}
          elapsedTime={elapsedTime}
          levelName={levelData.name}
          canShiftSafely={canShiftSafely}
          muted={muted}
          onToggleMute={toggleMute}
          onResetLevel={() => loadLevel(levelData)}
          onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          onToggleHint={handleToggleHint}
          showHint={showHint}
          onOpenEditor={() => setIsEditorOpen(true)}
        />

        {/* Canvas Renderer */}
        <GameCanvas
          maze={currentMaze}
          otherMaze={otherMaze}
          timeState={timeState}
          playerPos={playerPos}
          keysCollected={keysCollected}
          requiredKeys={levelData.requiredKeys}
          showHint={showHint}
          hintPath={hintPath}
          isWarping={isWarping}
        />

        {/* Controls Bar */}
        <Controls
          onMove={handleMove}
          onShift={handleShift}
          canShiftSafely={canShiftSafely}
          timeState={timeState}
          energy={energy}
        />
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl pt-3 border-t border-slate-800/80 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          Crafted with React, Vite & Python // Original by{' '}
          <a
            href="https://github.com/Amandadhich01"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline font-semibold"
          >
            Aman Dadhich
          </a>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span>[SPACE] SHIFT ERA</span>
          <span>[WASD / ARROWS] MOVE</span>
          <span>[R] RESTART</span>
        </div>
      </footer>

      {/* Modals */}
      <VictoryModal
        isOpen={isVictory}
        levelName={levelData.name}
        moves={moves}
        elapsedTime={elapsedTime}
        energy={energy}
        hasNextLevel={currentLevelIndex + 1 < CAMPAIGN_LEVELS.length}
        onNextLevel={handleNextLevel}
        onReplay={() => loadLevel(levelData)}
      />

      <LevelSelectModal
        isOpen={isLevelSelectOpen}
        onClose={() => setIsLevelSelectOpen(false)}
        currentLevelId={levelData.id}
        onSelectCampaignLevel={handleSelectCampaign}
        onGenerateProcedural={handleGenerateProcedural}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <LevelEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onPlayCustomLevel={(customLvl) => {
          setCurrentLevelIndex(-1);
          loadLevel(customLvl);
        }}
      />
    </div>
  );
}
