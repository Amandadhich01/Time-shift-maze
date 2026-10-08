# ⏳ Time-Shift Maze // Quantum Temporal Labyrinth

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Pygame](https://img.shields.io/badge/Pygame--ce-2.5%2B-FFD43B?logo=python&logoColor=blue)](https://pyga.me/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-blue?logo=github)](https://pages.github.com/)

> **A mind-bending sci-fi puzzle game where you shift between parallel timelines (the Ancient Past and the Cyber Future) to phase through barriers, gather Chrono Shards, and escape the temporal anomaly.**

Available as both a **cutting-edge React 19 web application** (playable directly in any browser with Web Audio procedural sound effects) and a **modernized 60 FPS Python/Pygame desktop edition**.

---

## 🌌 The Core Mechanic: Temporal Duality

In **Time-Shift Maze**, you exist simultaneously in two distinct historical eras:
1. **The Past (Ancient Era)**: Weathered stone ruins and crumbling monoliths. Certain paths are blocked by ancient stone pillars, while others remain accessible before centuries of decay.
2. **The Future (Cyber Matrix)**: High-tech digital grid where ancient stones have eroded into open corridors, but new high-voltage laser barriers and quantum forcefields have been erected.

By triggering a **Time Shift** (`[SPACE]`), your operative warps between timelines at the exact same physical coordinates. Use this dimensional warp to phase past obstacles, reach isolated chambers, collect all Chrono Shards, and reach the Chrono Gate!

---

## ✨ Key Features

- 🎮 **Dual-Platform Architecture**:
  - **React 19 Web Edition**: Ultra-smooth HTML5 Canvas graphics, particle systems, procedural Web Audio SFX (zero external audio file dependencies), mobile/touch D-pad, and responsive UI.
  - **Python 3 / Pygame Edition**: Native 60 FPS desktop experience with procedural synth audio and retro neon aesthetic.
- 🧮 **4D BFS Pathfinder & Guaranteed Solvability**:
  - Every procedural labyrinth is mathematically verified using a multi-dimensional breadth-first search across `(x, y, era, keys_collected)` to guarantee that every puzzle is 100% beatable!
- 🔮 **Temporal Oracle (In-Game AI Hint)**:
  - Stuck on a tricky puzzle? Activate the Oracle to visualize the optimal multi-timeline shortest path.
- 🛠️ **Built-in Temporal Architect (Level Editor)**:
  - Paint both the Past and Future timelines in real-time, test-play your custom puzzles, and export/import puzzle codes.
- ⚡ **Chrono Energy & Paradox Avoidance**:
  - Shifting eras consumes 5% Chrono Energy. Shifting into a solid wall triggers a Paradox Warning to safeguard the timeline.
- 🗺️ **Campaign Levels & Infinite Procedural Mode**:
  - 3 handcrafted pedagogical campaign levels + infinite custom generator (Compact, Standard, Labyrinth).

---

## 🕹️ Controls

| Action | Keyboard Shortcut | On-Screen / Touch |
| :--- | :--- | :--- |
| **Move Operative** | `W`, `A`, `S`, `D` or `Arrow Keys` | On-screen Virtual D-Pad |
| **Time Shift (Warp Era)** | `SPACEBAR` | Glowing **Time Shift** Button |
| **Restart Level** | `R` | Reload Icon in Header |
| **Toggle Oracle Hint** | `H` or Oracle Button | Sparkles Icon in Header |
| **Mute / Unmute SFX** | `M` | Speaker Icon in Header |
| **Exit (Python)** | `ESC` or `Q` | Window Close |

---

## 🚀 Quick Start Guide

### Option 1: Web Edition (React + Vite)

Play locally or build for deployment:

```bash
# 1. Clone the repository
git clone https://github.com/Amandadhich01/Time-shift-maze.git
cd Time-shift-maze

# 2. Install dependencies
npm install

# 3. Launch local development server
npm run dev
```

Open `http://localhost:3000` (or the URL shown in terminal) to play in your browser!

To generate a static build for production / hosting:
```bash
npm run build
```

---

### Option 2: Python Edition (Desktop / Pygame)

Run the desktop version directly with Python:

```bash
# 1. Install Pygame-ce
pip install -r requirements.txt

# 2. Launch the game
python main.py
```

*(Note: Running `python "import pygame.py"` also routes automatically to the upgraded game engine).*

---

## 📁 Repository Structure

```text
Time-shift-maze/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── src/
│   ├── audio/
│   │   └── soundManager.js     # Web Audio API procedural sound synthesizer
│   ├── components/
│   │   ├── Controls.jsx        # Touch D-Pad and Time Shift action trigger
│   │   ├── GameCanvas.jsx      # High-performance Canvas renderer + particles
│   │   ├── HelpModal.jsx       # Tactical operative guide & lore
│   │   ├── HUD.jsx             # Cyberpunk telemetry, battery gauge & meters
│   │   ├── LevelEditor.jsx     # Interactive multi-timeline level designer
│   │   ├── LevelSelectModal.jsx# Campaign selector & infinite generator
│   │   └── VictoryModal.jsx    # Celebration screen with confetti & star rating
│   ├── styles/
│   │   └── index.css           # Scanline shaders, animations & theme colors
│   ├── utils/
│   │   ├── levels.js           # Handcrafted campaign stages
│   │   ├── mazeGenerator.js    # Guaranteed solvable procedural maze generator
│   │   └── mazeSolver.js       # 4D BFS multi-timeline pathfinder
│   ├── App.jsx                 # Master application controller
│   └── main.jsx                # React DOM entry point
├── main.py                     # Python 60 FPS Pygame edition
├── maze_engine.py              # Python multi-timeline solver & maze generator
├── import pygame.py            # Backward-compatible redirect wrapper
├── package.json                # Web dependencies & scripts
├── vite.config.js              # Vite configuration
├── requirements.txt            # Python dependencies
└── README.md                   # Project documentation
```

---

## 🌐 Deploy to GitHub Pages (1-Click)

This repository includes a pre-configured GitHub Actions workflow:
1. Go to your GitHub repository: `Settings` → `Pages`.
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Push any commit to the `main` branch.
4. Your game will automatically go live at:  
   `https://Amandadhich01.github.io/Time-shift-maze/`

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

Developed with ❤️ by [Aman Dadhich](https://github.com/Amandadhich01).
