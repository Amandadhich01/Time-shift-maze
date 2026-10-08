"""
=============================================================
           TIME-SHIFT MAZE (PYTHON EDITION v2.0)
     Quantum Temporal Labyrinth - Parallel Realities
=============================================================
Controls:
  - Arrow Keys / WASD : Move operative
  - Spacebar          : Shift Time Era (-5 Energy)
  - R                 : Restart Level
  - ESC / Q           : Exit Simulation
"""

import sys
import math
import random
import pygame
from maze_engine import generate_guaranteed_maze, solve_time_maze

pygame.init()
pygame.display.set_caption("Time-Shift Maze // Quantum Operative")

# Constants
WIDTH, HEIGHT = 640, 700
TILE_SIZE = 40
HUD_HEIGHT = 80
GRID_ROWS, GRID_COLS = 15, 15
FPS = 60

# Palette
COLOR_BG_PAST = (16, 11, 4)
COLOR_BG_FUTURE = (4, 15, 23)
COLOR_WALL_PAST = (90, 40, 10)
COLOR_WALL_FUTURE = (8, 110, 140)
COLOR_WALL_FUTURE_GLOW = (6, 182, 212)
COLOR_FLOOR_PAST = (28, 19, 8)
COLOR_FLOOR_FUTURE = (6, 25, 38)
COLOR_PLAYER_PAST = (245, 158, 11)
COLOR_PLAYER_FUTURE = (34, 211, 238)
COLOR_KEY = (255, 215, 0)
COLOR_ENERGY = (16, 185, 129)
COLOR_EXIT_LOCKED = (239, 68, 68)
COLOR_EXIT_OPEN = (59, 130, 246)
COLOR_TEXT = (240, 240, 240)

screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()

font_title = pygame.font.SysFont("consolas", 20, bold=True)
font_hud = pygame.font.SysFont("consolas", 15, bold=True)
font_big = pygame.font.SysFont("consolas", 32, bold=True)

# Generate sound effects procedurally using pygame.mixer.Sound
def create_beep(freq, duration_ms, volume=0.1):
    try:
        sample_rate = 22050
        n_samples = int(sample_rate * (duration_ms / 1000.0))
        buf = bytearray()
        for i in range(n_samples):
            val = int(volume * 127.0 * math.sin(2.0 * math.pi * freq * (i / sample_rate))) + 128
            buf.append(val)
        return pygame.mixer.Sound(bytes(buf))
    except Exception:
        return None

sound_move = create_beep(520, 40, 0.05)
sound_shift = create_beep(300, 180, 0.12)
sound_key = create_beep(880, 120, 0.15)
sound_energy = create_beep(650, 90, 0.1)
sound_deny = create_beep(140, 120, 0.15)
sound_win = create_beep(980, 400, 0.2)

def play_sfx(sfx):
    if sfx:
        try:
            sfx.play()
        except Exception:
            pass

class Game:
    def __init__(self):
        self.reset()

    def reset(self):
        self.rows = GRID_ROWS
        self.cols = GRID_COLS
        self.required_keys = 3
        self.maze_past, self.maze_future = generate_guaranteed_maze(self.rows, self.cols, self.required_keys)
        self.player_x = 1
        self.player_y = 1
        self.time_state = 0  # 0 = Past, 1 = Future
        self.energy = 100
        self.keys_collected = 0
        self.score = 0
        self.moves = 0
        self.particles = []
        self.state = "PLAYING"  # PLAYING, WIN, GAMEOVER
        self.warp_anim = 0

    def add_particles(self, x, y, color, count=6):
        for _ in range(count):
            self.particles.append({
                'x': x,
                'y': y,
                'vx': (random.random() - 0.5) * 3,
                'vy': (random.random() - 0.5) * 3,
                'color': color,
                'life': 1.0
            })

    def shift_time(self):
        if self.state != "PLAYING":
            return

        if self.energy < 5:
            play_sfx(sound_deny)
            return

        other_maze = self.maze_future if self.time_state == 0 else self.maze_past
        # Paradox collision check
        if other_maze[self.player_y][self.player_x] == 1:
            play_sfx(sound_deny)
            return

        self.time_state = 1 - self.time_state
        self.energy = max(0, self.energy - 5)
        self.warp_anim = 15
        play_sfx(sound_shift)

        color = COLOR_PLAYER_PAST if self.time_state == 0 else COLOR_PLAYER_FUTURE
        px = self.player_x * TILE_SIZE + TILE_SIZE // 2
        py = self.player_y * TILE_SIZE + HUD_HEIGHT + TILE_SIZE // 2
        self.add_particles(px, py, color, 14)

        # Check pickup upon shifting
        self.check_tile()

    def move(self, dx, dy):
        if self.state != "PLAYING":
            return

        new_x = self.player_x + dx
        new_y = self.player_y + dy
        current_maze = self.maze_past if self.time_state == 0 else self.maze_future

        if 0 <= new_x < self.cols and 0 <= new_y < self.rows:
            if current_maze[new_y][new_x] != 1:
                self.player_x = new_x
                self.player_y = new_y
                self.moves += 1
                play_sfx(sound_move)
                self.check_tile()
            else:
                play_sfx(sound_deny)

    def check_tile(self):
        current_maze = self.maze_past if self.time_state == 0 else self.maze_future
        tile = current_maze[self.player_y][self.player_x]

        if tile == 2:  # Key
            self.keys_collected += 1
            self.score += 50
            current_maze[self.player_y][self.player_x] = 0
            play_sfx(sound_key)
            px = self.player_x * TILE_SIZE + TILE_SIZE // 2
            py = self.player_y * TILE_SIZE + HUD_HEIGHT + TILE_SIZE // 2
            self.add_particles(px, py, COLOR_KEY, 12)

        elif tile == 4:  # Energy Capsule
            self.energy = min(100, self.energy + 25)
            self.score += 20
            current_maze[self.player_y][self.player_x] = 0
            play_sfx(sound_energy)
            px = self.player_x * TILE_SIZE + TILE_SIZE // 2
            py = self.player_y * TILE_SIZE + HUD_HEIGHT + TILE_SIZE // 2
            self.add_particles(px, py, COLOR_ENERGY, 10)

        elif tile == 3 and self.keys_collected >= self.required_keys:
            self.state = "WIN"
            self.score += 200 + self.energy * 2
            play_sfx(sound_win)

    def update(self):
        # Update particles
        for p in self.particles[:]:
            p['x'] += p['vx']
            p['y'] += p['vy']
            p['life'] -= 0.05
            if p['life'] <= 0:
                self.particles.remove(p)

        if self.warp_anim > 0:
            self.warp_anim -= 1

    def draw(self, surface):
        is_past = self.time_state == 0
        bg_color = COLOR_BG_PAST if is_past else COLOR_BG_FUTURE
        surface.fill(bg_color)

        current_maze = self.maze_past if is_past else self.maze_future
        other_maze = self.maze_future if is_past else self.maze_past

        # Draw HUD Bar
        pygame.draw.rect(surface, (15, 23, 42), (0, 0, WIDTH, HUD_HEIGHT))
        pygame.draw.line(surface, (51, 65, 85), (0, HUD_HEIGHT), (WIDTH, HUD_HEIGHT), 2)

        era_text = "ERA: PAST (ANCIENT RUINS)" if is_past else "ERA: FUTURE (CYBER MATRIX)"
        era_color = (245, 158, 11) if is_past else (6, 182, 212)
        surface.blit(font_title.render(era_text, True, era_color), (15, 12))

        # Metrics
        hud_info = f"ENERGY: {self.energy}% | SHARDS: {self.keys_collected}/{self.required_keys} | MOVES: {self.moves} | SCORE: {self.score}"
        surface.blit(font_hud.render(hud_info, True, COLOR_TEXT), (15, 42))

        # Energy Progress Bar
        bar_w = 140
        bar_h = 10
        pygame.draw.rect(surface, (30, 41, 59), (WIDTH - bar_w - 15, 45, bar_w, bar_h), border_radius=4)
        fill_w = int((self.energy / 100.0) * bar_w)
        bar_color = COLOR_ENERGY if self.energy > 40 else (239, 68, 68)
        if fill_w > 0:
            pygame.draw.rect(surface, bar_color, (WIDTH - bar_w - 15, 45, fill_w, bar_h), border_radius=4)

        # Draw Maze
        for r in range(self.rows):
            for c in range(self.cols):
                tile = current_maze[r][c]
                rx = c * TILE_SIZE
                ry = r * TILE_SIZE + HUD_HEIGHT

                # Floor grid
                floor_col = COLOR_FLOOR_PAST if is_past else COLOR_FLOOR_FUTURE
                pygame.draw.rect(surface, floor_col, (rx, ry, TILE_SIZE, TILE_SIZE))
                pygame.draw.rect(surface, (20, 20, 25), (rx, ry, TILE_SIZE, TILE_SIZE), 1)

                # Alternate timeline wall ghost indicator
                if other_maze[r][c] == 1 and tile != 1:
                    ghost_col = (50, 30, 15) if is_past else (10, 40, 50)
                    pygame.draw.rect(surface, ghost_col, (rx + 4, ry + 4, TILE_SIZE - 8, TILE_SIZE - 8), 1)

                if tile == 1:  # Wall
                    if is_past:
                        pygame.draw.rect(surface, COLOR_WALL_PAST, (rx + 1, ry + 1, TILE_SIZE - 2, TILE_SIZE - 2))
                        pygame.draw.rect(surface, (150, 75, 20), (rx + 2, ry + 2, TILE_SIZE - 4, TILE_SIZE - 4), 1)
                    else:
                        pygame.draw.rect(surface, COLOR_WALL_FUTURE, (rx + 1, ry + 1, TILE_SIZE - 2, TILE_SIZE - 2))
                        pygame.draw.rect(surface, COLOR_WALL_FUTURE_GLOW, (rx + 2, ry + 2, TILE_SIZE - 4, TILE_SIZE - 4), 1)

                elif tile == 2:  # Shard
                    cx, cy = rx + TILE_SIZE // 2, ry + TILE_SIZE // 2
                    pygame.draw.circle(surface, COLOR_KEY, (cx, cy), 9)
                    pygame.draw.circle(surface, (255, 255, 200), (cx, cy), 4)

                elif tile == 4:  # Energy
                    cx, cy = rx + TILE_SIZE // 2, ry + TILE_SIZE // 2
                    points = [(cx, cy - 8), (cx + 8, cy), (cx, cy + 8), (cx - 8, cy)]
                    pygame.draw.polygon(surface, COLOR_ENERGY, points)

                elif tile == 3:  # Exit
                    cx, cy = rx + TILE_SIZE // 2, ry + TILE_SIZE // 2
                    unlocked = self.keys_collected >= self.required_keys
                    exit_col = COLOR_EXIT_OPEN if unlocked else COLOR_EXIT_LOCKED
                    pygame.draw.circle(surface, exit_col, (cx, cy), 13, 3)
                    if unlocked:
                        pygame.draw.circle(surface, (147, 197, 253), (cx, cy), 6)

        # Draw Particles
        for p in self.particles:
            alpha_col = p['color']
            pygame.draw.circle(surface, alpha_col, (int(p['x']), int(p['y'])), max(1, int(3 * p['life'])))

        # Draw Player
        px = self.player_x * TILE_SIZE + TILE_SIZE // 2
        py = self.player_y * TILE_SIZE + HUD_HEIGHT + TILE_SIZE // 2
        p_col = COLOR_PLAYER_PAST if is_past else COLOR_PLAYER_FUTURE
        pygame.draw.circle(surface, p_col, (px, py), 12)
        pygame.draw.circle(surface, (255, 255, 255), (px, py), 5)

        # Draw Warp overlay
        if self.warp_anim > 0:
            warp_surf = pygame.Surface((WIDTH, HEIGHT), pygame.SRCALPHA)
            warp_alpha = int((self.warp_anim / 15.0) * 120)
            warp_surf.fill((255, 255, 255, warp_alpha))
            surface.blit(warp_surf, (0, 0))

        # Win Banner
        if self.state == "WIN":
            overlay = pygame.Surface((WIDTH, HEIGHT), pygame.SRCALPHA)
            overlay.fill((0, 0, 0, 180))
            surface.blit(overlay, (0, 0))

            win_text = font_big.render("MISSION ACCOMPLISHED!", True, (34, 211, 238))
            sub_text = font_hud.render(f"Final Score: {self.score} | Moves: {self.moves}", True, COLOR_TEXT)
            res_text = font_hud.render("Press 'R' to Warp into a New Quantum Maze", True, (245, 158, 11))

            surface.blit(win_text, (WIDTH // 2 - win_text.get_width() // 2, HEIGHT // 2 - 50))
            surface.blit(sub_text, (WIDTH // 2 - sub_text.get_width() // 2, HEIGHT // 2 + 5))
            surface.blit(res_text, (WIDTH // 2 - res_text.get_width() // 2, HEIGHT // 2 + 40))


def main():
    game = Game()
    running = True

    while running:
        clock.tick(FPS)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

            elif event.type == pygame.KEYDOWN:
                if event.key in (pygame.K_ESCAPE, pygame.K_q):
                    running = False
                elif event.key == pygame.K_r:
                    game.reset()
                elif event.key == pygame.K_SPACE:
                    game.shift_time()
                elif event.key in (pygame.K_UP, pygame.K_w):
                    game.move(0, -1)
                elif event.key in (pygame.K_DOWN, pygame.K_s):
                    game.move(0, 1)
                elif event.key in (pygame.K_LEFT, pygame.K_a):
                    game.move(-1, 0)
                elif event.key in (pygame.K_RIGHT, pygame.K_d):
                    game.move(1, 0)

        game.update()
        game.draw(screen)
        pygame.display.flip()

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()
