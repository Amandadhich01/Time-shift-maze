import React, { useRef, useEffect } from 'react';

export default function GameCanvas({
  maze,
  otherMaze,
  timeState, // 0 = Past, 1 = Future
  playerPos, // [r, c]
  keysCollected,
  requiredKeys,
  showHint,
  hintPath = [],
  isWarping
}) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const playerAnimRef = useRef({ x: playerPos[1], y: playerPos[0] });

  // Update target coordinates smoothly
  useEffect(() => {
    // Add particle burst on position change
    for (let i = 0; i < 6; i++) {
      particlesRef.current.push({
        x: playerPos[1] + 0.5,
        y: playerPos[0] + 0.5,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        life: 1.0,
        color: timeState === 0 ? '#fbbf24' : '#22d3ee',
        size: Math.random() * 3 + 2
      });
    }
  }, [playerPos, timeState]);

  // Main rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const rows = maze.length;
    const cols = maze[0].length;
    let time = 0;

    const render = () => {
      time += 0.03;
      
      // Calculate responsive tile size
      const maxW = canvas.parentElement?.clientWidth || 600;
      const maxH = Math.min(window.innerHeight * 0.65, 620);
      const tileSize = Math.floor(Math.min(maxW / cols, maxH / rows));
      
      const width = tileSize * cols;
      const height = tileSize * rows;
      
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      // Smooth player position lerp
      playerAnimRef.current.x += (playerPos[1] - playerAnimRef.current.x) * 0.35;
      playerAnimRef.current.y += (playerPos[0] - playerAnimRef.current.y) * 0.35;

      // 1. Clear & Background
      const isPast = timeState === 0;
      ctx.fillStyle = isPast ? '#0f0a04' : '#030c14';
      ctx.fillRect(0, 0, width, height);

      // Subtle background grid
      ctx.strokeStyle = isPast ? 'rgba(245, 158, 11, 0.05)' : 'rgba(6, 182, 212, 0.06)';
      ctx.lineWidth = 1;
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * tileSize);
        ctx.lineTo(width, r * tileSize);
        ctx.stroke();
      }
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * tileSize, 0);
        ctx.lineTo(c * tileSize, height);
        ctx.stroke();
      }

      // 2. Draw Maze Tiles
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const tile = maze[r][c];
          const x = c * tileSize;
          const y = r * tileSize;

          // Check if other timeline has a wall here (Ghost indicator)
          const otherIsWall = otherMaze && otherMaze[r] && otherMaze[r][c] === 1;

          if (tile === 1) {
            // Solid Wall
            if (isPast) {
              // Ancient Stone Block
              ctx.fillStyle = '#451a03';
              ctx.fillRect(x + 1, y + 1, tileSize - 2, tileSize - 2);

              ctx.strokeStyle = '#78350f';
              ctx.lineWidth = 2;
              ctx.strokeRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

              // Stone texture lines
              ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
              ctx.fillRect(x + 4, y + 4, tileSize - 8, 2);
              ctx.fillRect(x + 6, y + tileSize / 2, tileSize - 12, 2);
            } else {
              // Futuristic Laser Barrier
              ctx.fillStyle = 'rgba(8, 145, 178, 0.2)';
              ctx.fillRect(x + 1, y + 1, tileSize - 2, tileSize - 2);

              ctx.strokeStyle = '#06b6d4';
              ctx.lineWidth = 2;
              ctx.shadowColor = '#06b6d4';
              ctx.shadowBlur = 8;
              ctx.strokeRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
              ctx.shadowBlur = 0;

              // Laser grid diagonal
              ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(x + 3, y + 3);
              ctx.lineTo(x + tileSize - 3, y + tileSize - 3);
              ctx.stroke();
            }
          } else {
            // Open Floor
            // If the opposite timeline has a wall at this open spot, draw a faint temporal warning hatch!
            if (otherIsWall) {
              ctx.fillStyle = isPast ? 'rgba(6, 182, 212, 0.08)' : 'rgba(245, 158, 11, 0.08)';
              ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

              ctx.strokeStyle = isPast ? 'rgba(6, 182, 212, 0.25)' : 'rgba(245, 158, 11, 0.25)';
              ctx.setLineDash([3, 3]);
              ctx.lineWidth = 1;
              ctx.strokeRect(x + 3, y + 3, tileSize - 6, tileSize - 6);
              ctx.setLineDash([]);
            }

            // Key / Chrono Shard
            if (tile === 2) {
              const pulse = Math.sin(time * 3 + r * c) * 0.2 + 0.9;
              const radius = (tileSize / 3.2) * pulse;

              ctx.save();
              ctx.shadowColor = '#fbbf24';
              ctx.shadowBlur = 12;
              ctx.fillStyle = '#f59e0b';
              ctx.beginPath();
              ctx.arc(x + tileSize / 2, y + tileSize / 2, radius, 0, Math.PI * 2);
              ctx.fill();

              // Inner core
              ctx.fillStyle = '#fef08a';
              ctx.beginPath();
              ctx.arc(x + tileSize / 2, y + tileSize / 2, radius * 0.45, 0, Math.PI * 2);
              ctx.fill();

              // Orbital spinning ring
              ctx.strokeStyle = '#fde047';
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.ellipse(
                x + tileSize / 2,
                y + tileSize / 2,
                radius * 1.4,
                radius * 0.6,
                time * 2,
                0,
                Math.PI * 2
              );
              ctx.stroke();
              ctx.restore();
            }

            // Energy Capsule (+25 Energy)
            if (tile === 4) {
              const pulse = Math.sin(time * 4) * 0.15 + 0.85;
              const sz = (tileSize / 2.8) * pulse;

              ctx.save();
              ctx.shadowColor = '#10b981';
              ctx.shadowBlur = 10;
              ctx.fillStyle = '#10b981';

              // Diamond shape
              ctx.beginPath();
              ctx.moveTo(x + tileSize / 2, y + tileSize / 2 - sz);
              ctx.lineTo(x + tileSize / 2 + sz, y + tileSize / 2);
              ctx.lineTo(x + tileSize / 2, y + tileSize / 2 + sz);
              ctx.lineTo(x + tileSize / 2 - sz, y + tileSize / 2);
              ctx.closePath();
              ctx.fill();

              ctx.fillStyle = '#a7f3d0';
              ctx.fillRect(x + tileSize / 2 - 2, y + tileSize / 2 - 2, 4, 4);
              ctx.restore();
            }

            // Exit Portal / Chrono Gate
            if (tile === 3) {
              const isUnlocked = keysCollected >= requiredKeys;
              const pSize = tileSize * 0.4;
              const cx = x + tileSize / 2;
              const cy = y + tileSize / 2;

              ctx.save();
              if (isUnlocked) {
                // Swirling active wormhole
                ctx.shadowColor = '#38bdf8';
                ctx.shadowBlur = 20;

                const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, pSize * 1.3);
                grad.addColorStop(0, '#ffffff');
                grad.addColorStop(0.4, '#06b6d4');
                grad.addColorStop(0.8, '#6366f1');
                grad.addColorStop(1, 'transparent');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(cx, cy, pSize * 1.2, 0, Math.PI * 2);
                ctx.fill();

                // Swirling vortex spiral
                ctx.strokeStyle = '#ec4899';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let a = 0; a < Math.PI * 4; a += 0.2) {
                  const r = (a / (Math.PI * 4)) * pSize;
                  const px = cx + Math.cos(a + time * 4) * r;
                  const py = cy + Math.sin(a + time * 4) * r;
                  if (a === 0) ctx.moveTo(px, py);
                  else ctx.lineTo(px, py);
                }
                ctx.stroke();
              } else {
                // Locked Portal (Event Horizon sealed)
                ctx.shadowColor = '#ef4444';
                ctx.shadowBlur = 8;
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(cx, cy, pSize, 0, Math.PI * 2);
                ctx.stroke();

                // Lock icon cross
                ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
                ctx.beginPath();
                ctx.arc(cx, cy, pSize * 0.7, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#fee2e2';
                ctx.font = `bold ${Math.floor(tileSize * 0.35)}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🔒', cx, cy);
              }
              ctx.restore();
            }
          }
        }
      }

      // 3. Draw AI Solution Hint Path (if requested)
      if (showHint && hintPath && hintPath.length > 0) {
        ctx.save();
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 4]);
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 8;

        ctx.beginPath();
        hintPath.forEach((pt, idx) => {
          const hx = pt.c * tileSize + tileSize / 2;
          const hy = pt.r * tileSize + tileSize / 2;
          if (idx === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        });
        ctx.stroke();
        ctx.restore();
      }

      // 4. Draw Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.04;

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x * tileSize, p.y * tileSize, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 5. Draw Player Avatar (Time Traveler)
      const px = playerAnimRef.current.x * tileSize + tileSize / 2;
      const py = playerAnimRef.current.y * tileSize + tileSize / 2;
      const playerRadius = tileSize * 0.36;

      ctx.save();
      // Outer temporal shield pulse
      const shieldGlow = isPast ? '#f59e0b' : '#06b6d4';
      ctx.shadowColor = shieldGlow;
      ctx.shadowBlur = 18;

      ctx.strokeStyle = shieldGlow;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(px, py, playerRadius + 3 + Math.sin(time * 6) * 2, 0, Math.PI * 2);
      ctx.stroke();

      // Main body
      ctx.fillStyle = isPast ? '#b45309' : '#0e7490';
      ctx.beginPath();
      ctx.arc(px, py, playerRadius, 0, Math.PI * 2);
      ctx.fill();

      // Core visor / Quantum Chronometer
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px, py, playerRadius * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Visor iris color
      ctx.fillStyle = isPast ? '#fbbf24' : '#22d3ee';
      ctx.beginPath();
      ctx.arc(px, py, playerRadius * 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Loop
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [maze, otherMaze, timeState, playerPos, keysCollected, requiredKeys, showHint, hintPath]);

  return (
    <div className={`relative flex items-center justify-center p-2 rounded-2xl border transition-all duration-300 ${
      timeState === 0
        ? 'border-amber-500/40 bg-amber-950/20 shadow-[0_0_30px_rgba(245,158,11,0.15)]'
        : 'border-cyan-500/40 bg-cyan-950/20 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
    } ${isWarping ? 'timeline-warp-active' : ''}`}>
      <canvas
        ref={canvasRef}
        className="rounded-xl max-w-full block shadow-2xl cursor-crosshair touch-none"
      />
    </div>
  );
}
