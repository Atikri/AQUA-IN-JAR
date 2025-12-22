import pygame
import sys

# --- Configuration ---
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
GRID_SIZE = 60
ROWS = 8
COLS = 8
MARGIN = 5

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GRAY = (200, 200, 200)
GREEN_BG = (200, 255, 200) # P1 Territory
RED_BG = (255, 200, 200)   # P2 Territory
GREEN_UNIT = (0, 150, 0)   # P1 Unit
RED_UNIT = (200, 0, 0)     # P2 Unit
GOLD = (255, 215, 0)       # Highlight

# Initialize Pygame
pygame.init()
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Season Tactics")
font = pygame.font.SysFont('Arial', 20)

# --- Class Definitions ---

class Unit:
    def __init__(self, row, col, owner):
        self.row = row
        self.col = col
        self.owner = owner  # 1 for Green, 2 for Red
        self.has_moved = False
        self.name = "Unit"
        
        # Default stats (to be overridden)
        self.max_hp = 10
        self.hp = self.max_hp
        self.base_damage = 0
        self.base_move_range = 0
        self.attack_range = 0

    def start_turn(self, grid):
        """Logic at start of turn: Heal if on own territory"""
        self.has_moved = False
        # Buff: Heal 1 HP if on own territory
        if self._is_on_own_territory(grid):
            self.heal(1)

    def get_move_range(self, grid):
        """Calculate effective move range based on territory"""
        penalty = 0
        # Debuff: -1 Move Range if on enemy territory
        if self._is_on_enemy_territory(grid):
            penalty = 1
        
        return max(0, self.base_move_range - penalty)

    def get_current_damage(self, grid):
        """Calculate effective damage based on territory"""
        bonus = 0
        # Buff: +1 Damage if on own territory
        if self._is_on_own_territory(grid):
            bonus = 1
        return self.base_damage + bonus

    def receive_damage(self, damage):
        self.hp -= damage

    def heal(self, amount):
        self.hp = min(self.hp + amount, self.max_hp)

    def paint_territory(self, grid, r, c):
        """Paint the target tile"""
        if 0 <= r < ROWS and 0 <= c < COLS:
            grid[r][c] = self.owner

    def _is_on_own_territory(self, grid):
        if 0 <= self.row < ROWS and 0 <= self.col < COLS:
            return grid[self.row][self.col] == self.owner
        return False

    def _is_on_enemy_territory(self, grid):
        if 0 <= self.row < ROWS and 0 <= self.col < COLS:
            tile_owner = grid[self.row][self.col]
            return tile_owner != 0 and tile_owner != self.owner
        return False

class Base(Unit):
    def __init__(self, row, col, owner):
        super().__init__(row, col, owner)
        self.name = 'Base'
        self.max_hp = 50
        self.hp = 50
        self.base_damage = 0
        self.base_move_range = 0
        self.attack_range = 0

class Infantry(Unit):
    def __init__(self, row, col, owner):
        super().__init__(row, col, owner)
        self.name = 'Infantry'
        self.max_hp = 10
        self.hp = 10
        self.base_damage = 3
        self.base_move_range = 3
        self.attack_range = 1

    def paint_territory(self, grid, r, c):
        # High efficiency: Paint target + 4 neighbors (Cross shape)
        super().paint_territory(grid, r, c)
        neighbors = [(r+1, c), (r-1, c), (r, c+1), (r, c-1)]
        for nr, nc in neighbors:
            if 0 <= nr < ROWS and 0 <= nc < COLS:
                grid[nr][nc] = self.owner

class Tank(Unit):
    def __init__(self, row, col, owner):
        super().__init__(row, col, owner)
        self.name = 'Tank'
        self.max_hp = 20 # High HP
        self.hp = 20
        self.base_damage = 4 
        self.base_move_range = 1
        self.attack_range = 1
    
    # Tank could have damage reduction here if requested, 
    # but "cannot be instantly killed" is often covered by High HP in simple prototypes.

class Ranged(Unit):
    def __init__(self, row, col, owner):
        super().__init__(row, col, owner)
        self.name = 'Ranged'
        self.max_hp = 6 # Low HP
        self.hp = 6
        self.base_damage = 2
        self.base_move_range = 2
        self.attack_range = 3

class Game:
    def __init__(self):
        self.grid = [[0 for _ in range(COLS)] for _ in range(ROWS)]
        self.units = []
        self.turn = 1 # 1=Green, 2=Red
        self.selected_unit = None
        self.msg = "Player 1's Turn (Green)"
        self.init_board()

    def init_board(self):
        # Bases
        self.units.append(Base(0, 0, 1))
        self.units.append(Base(ROWS-1, COLS-1, 2))
        self.grid[0][0] = 1
        self.grid[ROWS-1][COLS-1] = 2
        
        # P1 Units
        self.units.append(Infantry(0, 1, 1))
        self.units.append(Ranged(1, 0, 1))
        self.units.append(Tank(1, 1, 1))
        
        # P2 Units
        self.units.append(Infantry(ROWS-1, COLS-2, 2))
        self.units.append(Ranged(ROWS-2, COLS-1, 2))
        self.units.append(Tank(ROWS-2, COLS-2, 2))

    def get_unit_at(self, row, col):
        for u in self.units:
            if u.row == row and u.col == col:
                return u
        return None

    def switch_turn(self):
        self.turn = 1 if self.turn == 2 else 2
        self.selected_unit = None
        self.msg = f"Player {self.turn}'s Turn"
        
        # Start turn logic
        for u in self.units:
            if u.owner == self.turn:
                u.start_turn(self.grid)
            else:
                u.has_moved = False

    def handle_click(self, pos):
        x, y = pos
        c = x // (GRID_SIZE + MARGIN)
        r = y // (GRID_SIZE + MARGIN)

        if r >= ROWS or c >= COLS:
            return

        clicked_unit = self.get_unit_at(r, c)

        # 1. Select Unit
        if self.selected_unit is None:
            if clicked_unit and clicked_unit.owner == self.turn and not clicked_unit.has_moved:
                self.selected_unit = clicked_unit
                range_ = clicked_unit.get_move_range(self.grid)
                self.msg = f"{clicked_unit.name} Selected. Move: {range_}"
            return

        # 2. Action
        unit = self.selected_unit
        
        # Switch selection
        if clicked_unit and clicked_unit.owner == self.turn:
            if not clicked_unit.has_moved:
                self.selected_unit = clicked_unit
                range_ = clicked_unit.get_move_range(self.grid)
                self.msg = f"Switched to {clicked_unit.name}. Move: {range_}"
            return

        dist = abs(unit.row - r) + abs(unit.col - c)
        
        # Attack
        if clicked_unit and clicked_unit.owner != self.turn:
            if dist <= unit.attack_range:
                dmg = unit.get_current_damage(self.grid)
                clicked_unit.receive_damage(dmg)
                
                self.msg = f"Attacked! Dealt {dmg} damage."
                if clicked_unit.hp <= 0:
                    if isinstance(clicked_unit, Base):
                        self.msg = f"Player {self.turn} WINS!"
                    self.units.remove(clicked_unit)
                
                unit.has_moved = True
                self.selected_unit = None
            else:
                self.msg = "Target out of range!"
            return

        # Move
        if clicked_unit is None:
            move_range = unit.get_move_range(self.grid)
            if dist <= move_range:
                unit.row = r
                unit.col = c
                
                unit.paint_territory(self.grid, r, c)
                
                unit.has_moved = True
                self.selected_unit = None
                self.msg = "Moved and painted territory."
            else:
                self.msg = f"Too far! Max range: {move_range}"

    def draw(self, surface):
        surface.fill(WHITE)
        
        # Draw Grid
        for r in range(ROWS):
            for c in range(COLS):
                color = GRAY
                if self.grid[r][c] == 1: color = GREEN_BG
                elif self.grid[r][c] == 2: color = RED_BG
                
                rect = (c * (GRID_SIZE + MARGIN) + MARGIN,
                        r * (GRID_SIZE + MARGIN) + MARGIN,
                        GRID_SIZE, GRID_SIZE)
                pygame.draw.rect(surface, color, rect)

        # Draw Units
        for u in self.units:
            color = GREEN_UNIT if u.owner == 1 else RED_UNIT
            center_x = u.col * (GRID_SIZE + MARGIN) + MARGIN + GRID_SIZE // 2
            center_y = u.row * (GRID_SIZE + MARGIN) + MARGIN + GRID_SIZE // 2
            
            # Draw shapes based on class
            if isinstance(u, Base):
                pygame.draw.rect(surface, color, (center_x-20, center_y-20, 40, 40))
                pygame.draw.rect(surface, GOLD, (center_x-20, center_y-20, 40, 40), 3)
            elif isinstance(u, Infantry):
                pygame.draw.circle(surface, color, (center_x, center_y), 20)
            elif isinstance(u, Tank):
                pygame.draw.rect(surface, color, (center_x-22, center_y-22, 44, 44))
                pygame.draw.rect(surface, BLACK, (center_x-22, center_y-22, 44, 44), 2)
            elif isinstance(u, Ranged):
                points = [(center_x, center_y-20), (center_x-15, center_y+10), (center_x+15, center_y+10)]
                pygame.draw.polygon(surface, color, points)

            # Selection Highlight
            if u == self.selected_unit:
                pygame.draw.circle(surface, GOLD, (center_x, center_y), 28, 3)

            # HP Label
            hp_text = font.render(str(u.hp), True, BLACK)
            surface.blit(hp_text, (center_x - 5, center_y - 12))

        # UI
        ui_text = font.render(self.msg, True, BLACK)
        surface.blit(ui_text, (10, SCREEN_HEIGHT - 40))
        turn_btn = font.render("[SPACE to End Turn]", True, BLACK)
        surface.blit(turn_btn, (SCREEN_WIDTH - 250, SCREEN_HEIGHT - 40))

def main():
    clock = pygame.time.Clock()
    game = Game()

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            
            if event.type == pygame.MOUSEBUTTONDOWN:
                game.handle_click(pygame.mouse.get_pos())
            
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    game.switch_turn()

        game.draw(screen)
        pygame.display.flip()
        clock.tick(60)

if __name__ == "__main__":
    main()
