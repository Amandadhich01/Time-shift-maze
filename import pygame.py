import pygame
import random

pygame.init()

WIDTH, HEIGHT = 600, 600
TILE_SIZE = 40
ROWS, COLS = HEIGHT // TILE_SIZE, WIDTH // TILE_SIZE
WIN = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Time-Shift Maze")

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
BLUE = (0, 0, 255)
GREEN = (0, 200, 0)
RED = (200, 0, 0)
YELLOW = (255, 255, 0)

player_x, player_y = 1, 1
energy = 100
score = 0
keys_collected = 0
required_keys = 3

def generate_maze():
    maze = [[0 if random.random() > 0.2 else 1 for _ in range(COLS)] for _ in range(ROWS)]
    maze[1][1] = 0
    maze[ROWS - 2][COLS - 2] = 3  # Exit
    
    placed = 0
    while placed < required_keys:
        r, c = random.randint(1, ROWS - 2), random.randint(1, COLS - 2)
        if maze[r][c] == 0:
            maze[r][c] = 2
            placed += 1
    return maze

maze_past = generate_maze()
maze_future = generate_maze()

time_state = 0

def draw_maze(maze):
    for r in range(ROWS):
        for c in range(COLS):
            tile = maze[r][c]
            if tile == 1:
                pygame.draw.rect(WIN, BLACK, (c*TILE_SIZE, r*TILE_SIZE, TILE_SIZE, TILE_SIZE))
            elif tile == 2:
                pygame.draw.rect(WIN, YELLOW, (c*TILE_SIZE, r*TILE_SIZE, TILE_SIZE, TILE_SIZE))
            elif tile == 3:
                pygame.draw.rect(WIN, BLUE, (c*TILE_SIZE, r*TILE_SIZE, TILE_SIZE, TILE_SIZE))

run = True
clock = pygame.time.Clock()

while run:
    clock.tick(10)
    WIN.fill(WHITE)

    maze = maze_past if time_state == 0 else maze_future
    draw_maze(maze)


    pygame.draw.rect(WIN, RED, (player_x*TILE_SIZE, player_y*TILE_SIZE, TILE_SIZE, TILE_SIZE))

    font = pygame.font.SysFont(None, 30)
    hud = font.render(f"Energy: {energy}  Keys: {keys_collected}/{required_keys}  Score: {score}", True, BLACK)
    WIN.blit(hud, (10, HEIGHT - 30))

    pygame.display.update()


    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False

    keys = pygame.key.get_pressed()
    new_x, new_y = player_x, player_y

    if keys[pygame.K_UP]:
        new_y -= 1
    if keys[pygame.K_DOWN]:
        new_y += 1
    if keys[pygame.K_LEFT]:
        new_x -= 1
    if keys[pygame.K_RIGHT]:
        new_x += 1

    if keys[pygame.K_SPACE] and energy > 0:
        time_state = 1 - time_state
        energy -= 5
        pygame.time.delay(150)  


    if 0 <= new_x < COLS and 0 <= new_y < ROWS:
        if maze[new_y][new_x] != 1:
            player_x, player_y = new_x, new_y


    if maze[player_y][player_x] == 2:
        keys_collected += 1
        score += 10
        maze[player_y][player_x] = 0

    if maze[player_y][player_x] == 3 and keys_collected == required_keys:
        print("You Win! Final Score:", score)
        run = False

pygame.quit()

