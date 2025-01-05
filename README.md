# The Cartographer Game

The Cartographer is a single-player, browser-based game designed for relaxation and creative exploration. In this game, players generate a unique hexagonal map by placing biome tiles based on adjacency rules and recording their journey in an expedition journal. The game aims to provide a calm, thoughtful experience while fostering an appreciation for map-making and world-building.

---

## Features

- **Hexagonal Grid System:**
  Players interact with a dynamically generated hexagonal grid, which forms the game board.

- **Dice Mechanics:**
  Rolling a die determines the number of biome options available for selection during a turn.

- **Biome Selection and Placement:**
  Biomes are selected and placed on the grid based on adjacency rules, ensuring a logical and aesthetically pleasing map layout.

- **Expedition Journal:**
  Every action, such as rolling the die or placing a tile, is recorded in the journal, creating a narrative of the player's journey.

---

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge) with JavaScript enabled.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cartographer-game.git
   ```

2. Navigate to the project directory:
   ```bash
   cd cartographer-game
   ```

3. Open the `index.html` file in your browser to start the game.

---

## Game Rules

1. **Starting a New Game:**
   Click the "New Game" button to initialize the game board and reset all progress.

2. **Rolling the Die:**
   Click the die to roll it. The number rolled determines the number of biome options available for placement.

3. **Placing Biomes:**
   - Select a biome from the available options.
   - Place it on the grid, adhering to adjacency rules that enforce logical biome connections.

4. **Recording Actions:**
   The expedition journal logs each action, providing a summary of the player's decisions.

5. **Completing the Map:**
   The game ends when the player decides to stop exploring or when all tiles are placed.

---

## File Structure

- **index.html**
  - Defines the game layout, including the hex grid, controls, and journal.

- **css/styles.css**
  - Contains the styling for the game, including responsive design and hover effects.

- **scripts/game-config.js**
  - Stores configuration details such as biome colors and adjacency rules.

- **scripts/game.js**
  - Implements the game logic, including state management, dice rolling, and tile placement.

---

## Future Enhancements

- Add animations for smoother gameplay transitions.
- Implement save/load functionality to preserve game progress.
- Introduce additional card mechanics for discoveries and wisdom.
- Expand adjacency rules for more complex map generation.
- Optimize for mobile devices with improved touch controls.

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Acknowledgments

Special thanks to the creators of hexagonal grid algorithms and game design resources that inspired this project.

