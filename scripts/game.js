// Game state management
class GameState {
    constructor() {
        this.boardSize = CONFIG.BOARD_SIZE;
        this.currentDie = 0;
        this.placedTiles = new Map();
        this.selectedBiome = null;
        this.journal = [];
        this.availableBiomes = new Set(Object.keys(CONFIG.BIOME_COLORS));
        this.currentRollBiomes = new Set(); // Track biomes for current roll
    }

    reset() {
        this.placedTiles.clear();
        this.journal = [];
        this.selectedBiome = null;
        this.currentDie = 0;
        this.availableBiomes = new Set(Object.keys(CONFIG.BIOME_COLORS));
        this.currentRollBiomes.clear();
    }
}

// Game manager
class Game {
    constructor() {
        console.log("Game constructor called");
        this.state = new GameState();
        this.initializeEventListeners();
        this.startNewGame(); // Initialize the game board
        console.log("Game initialization complete");
    }

    initializeEventListeners() {
        console.log("Initializing event listeners...");
        const die = document.getElementById('die');
        if (die) {
            // Bind the method to the class instance
            const boundRollDie = this.rollDie.bind(this);
            die.addEventListener('click', boundRollDie);
            console.log("Die event listener registered.");
            
            // Add visual feedback for clickability
            die.style.cursor = 'pointer';
        } else {
            console.error("Die element not found in the DOM.");
        }
    
        const newGameBtn = document.getElementById('newGameBtn');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => this.startNewGame());
            console.log("New Game button listener registered.");
        }
    }

    startNewGame() {
        console.log("Starting new game...");
        this.state.reset();
        document.getElementById('journalEntries').innerHTML = '';
        document.getElementById('die').textContent = 'Roll';
        document.getElementById('biomeSelection').innerHTML = '';
        this.initializeGrid();
        this.addJournalEntry('Started a new expedition');
        console.log("New game started");
    }

    rollDie() {
        console.log("rollDie method called");
        const die = document.getElementById('die');
        if (!die) {
            console.error("Die element not found during rollDie execution.");
            return;
        }
        
        // Clear any existing transition
        die.style.transition = 'none';
        die.offsetHeight; // Force reflow
        die.style.transition = 'transform 0.3s ease';
        
        this.state.currentDie = Math.floor(Math.random() * 6) + 1;
        die.textContent = this.state.currentDie;
        
        // Add a rotation animation
        die.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            die.style.transform = '';
            this.updateBiomeSelection(this.state.currentDie);
        }, 300);

        this.addJournalEntry(`Rolled a ${this.state.currentDie}`);
        console.log(`Die rolled: ${this.state.currentDie}`);
    }

    updateBiomeSelection(count) {
        console.log(`Updating biome selection with count: ${count}`);
        const selection = document.getElementById('biomeSelection');
        if (!selection) {
            console.error("Biome selection element not found");
            return;
        }
        
        selection.innerHTML = '';
        
        // If this is a new roll (not just updating after placement)
        if (count > 0) {
            const availableBiomes = Array.from(this.state.availableBiomes);
            
            if (availableBiomes.length === 0) {
                this.addJournalEntry("No more biomes available!");
                selection.innerHTML = '<div class="no-biomes">No more biomes available!</div>';
                return;
            }

            // Clear previous roll's biomes and select new ones
            this.state.currentRollBiomes.clear();
            const selectedCount = Math.min(count, availableBiomes.length);
            const shuffled = availableBiomes.sort(() => Math.random() - 0.5);
            const selectedBiomes = shuffled.slice(0, selectedCount);
            
            selectedBiomes.forEach(biome => {
                this.state.currentRollBiomes.add(biome);
            });
        }
        
        // Display current roll's remaining biomes
        this.state.currentRollBiomes.forEach(biome => {
            const button = document.createElement('div');
            button.className = 'biome-btn';
            button.dataset.name = biome;
            button.dataset.biome = biome;
            const shortName = this.getShortBiomeName(biome);
            button.textContent = shortName;
            button.style.backgroundColor = CONFIG.BIOME_COLORS[biome];
            
            button.draggable = true;
            button.addEventListener('dragstart', this.handleDragStart.bind(this));
            button.addEventListener('dragend', this.handleDragEnd.bind(this));
            button.addEventListener('click', () => this.selectBiome(biome));
            selection.appendChild(button);
        });
    }

    getShortBiomeName(biome) {
        // Create shortened versions of biome names
        const words = biome.split(' ');
        if (words.length === 1) {
            return words[0].substring(0, 3);
        }
        return words.map(word => word[0]).join('');
    }

    handleDragStart(e) {
        const biome = e.target.dataset.biome;
        e.dataTransfer.setData('text/plain', biome);
        e.target.classList.add('dragging');
        this.selectBiome(biome);
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    handleDragOver(e) {
        e.preventDefault(); // Necessary to allow dropping
        
        const hex = e.target;
        const q = parseInt(hex.dataset.q);
        const r = parseInt(hex.dataset.r);
        
        // Show visual feedback for valid/invalid placement
        if (this.state.selectedBiome && this.isValidPlacement(q, r, this.state.selectedBiome)) {
            hex.classList.add('valid-drop');
        } else {
            hex.classList.add('invalid-drop');
        }
    }

    handleDragEnter(e) {
        e.preventDefault();
        const hex = e.target;
        hex.classList.add('drag-over');
    }

    handleDragLeave(e) {
        const hex = e.target;
        hex.classList.remove('drag-over');
        hex.classList.remove('valid-drop');
        hex.classList.remove('invalid-drop');
    }

    handleDrop(e) {
        e.preventDefault();
        const hex = e.target;
        const biome = e.dataTransfer.getData('text/plain');
        const q = parseInt(hex.dataset.q);
        const r = parseInt(hex.dataset.r);
        
        // Remove drag feedback classes
        hex.classList.remove('drag-over');
        hex.classList.remove('valid-drop');
        hex.classList.remove('invalid-drop');
        
        // Place the tile using existing logic
        this.placeTile(q, r);
    }

    initializeGrid() {
        console.log("Initializing grid...");
        const grid = document.getElementById('hexGrid');
        if (!grid) {
            console.error("Grid element not found");
            return;
        }
        
        grid.innerHTML = '';
        const size = this.state.boardSize;
        const hexSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hex-size'));
        
        const gridCenter = {
            x: grid.offsetWidth / 2,
            y: grid.offsetHeight / 2
        };
        
        for (let q = -size; q <= size; q++) {
            for (let r = -size; r <= size; r++) {
                if (Math.abs(q + r) <= size) {
                    const hex = document.createElement('div');
                    hex.className = 'hex';
                    
                    const x = hexSize * (3/2 * q);
                    const y = hexSize * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
                    
                    hex.style.left = `${x + gridCenter.x}px`;
                    hex.style.top = `${y + gridCenter.y}px`;
                    hex.dataset.q = q;
                    hex.dataset.r = r;
                    
                    // Add drag and drop event listeners
                    hex.addEventListener('dragover', this.handleDragOver.bind(this));
                    hex.addEventListener('drop', this.handleDrop.bind(this));
                    hex.addEventListener('dragenter', this.handleDragEnter.bind(this));
                    hex.addEventListener('dragleave', this.handleDragLeave.bind(this));
                    
                    // Keep click handler as fallback
                    hex.addEventListener('click', () => this.placeTile(q, r));
                    grid.appendChild(hex);
                }
            }
        }
        console.log("Grid initialization complete");
    }

    getNeighbors(q, r) {
        return CONFIG.HEX_DIRECTIONS.map(([dq, dr]) => [q + dq, r + dr]);
    }

    isValidPlacement(q, r, biome) {
        // Always allow first tile placement
        if (this.state.placedTiles.size === 0) return true;
        
        const neighbors = this.getNeighbors(q, r);
        let hasAdjacentTile = false;
        let isValidAdjacency = false;
        
        for (const [nq, nr] of neighbors) {
            const key = `${nq},${nr}`;
            const neighborBiome = this.state.placedTiles.get(key);
            
            if (neighborBiome) {
                hasAdjacentTile = true;
                
                // Special case for Rivers/Streams
                if (biome === 'Rivers/Streams' || neighborBiome === 'Rivers/Streams') {
                    isValidAdjacency = true;
                    break;
                }
                
                // Check both directions of adjacency rules
                if (CONFIG.ADJACENCY_RULES[biome]?.includes(neighborBiome) ||
                    CONFIG.ADJACENCY_RULES[neighborBiome]?.includes(biome)) {
                    isValidAdjacency = true;
                    break;
                }
            }
        }
        
        return hasAdjacentTile && isValidAdjacency;
    }

    selectBiome(biome) {
        console.log(`Selecting biome: ${biome}`);
        this.state.selectedBiome = biome;
        
        // Update UI to show selected biome
        const buttons = document.querySelectorAll('.biome-btn');
        buttons.forEach(btn => {
            btn.classList.remove('selected');
            if (btn.dataset.biome === biome) {
                btn.classList.add('selected');
            }
        });
        
        this.addJournalEntry(`Selected ${biome} biome`);
    }

    addJournalEntry(entry) {
        const journal = document.getElementById('journalEntries');
        if (!journal) {
            console.error('Journal entries container not found');
            return;
        }
        
        const logEntry = document.createElement('div');
        logEntry.className = 'journal-entry';
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${entry}`;
        journal.appendChild(logEntry);
        
        // Auto-scroll to bottom
        journal.scrollTop = journal.scrollHeight;
    }

    placeTile(q, r) {
        console.log(`Attempting to place tile at q:${q}, r:${r}`);
        if (!this.state.selectedBiome) {
            this.addJournalEntry('Select a biome before placing a tile.');
            return;
        }

        const key = `${q},${r}`;
        if (this.state.placedTiles.has(key)) {
            this.addJournalEntry('Tile already placed here.');
            return;
        }

        if (!this.isValidPlacement(q, r, this.state.selectedBiome)) {
            this.addJournalEntry('Invalid placement. Follow biome adjacency rules.');
            return;
        }

        const grid = document.getElementById('hexGrid');
        const tile = grid.querySelector(`[data-q='${q}'][data-r='${r}']`);

        if (tile) {
            tile.style.backgroundColor = CONFIG.BIOME_COLORS[this.state.selectedBiome];
            this.state.placedTiles.set(key, this.state.selectedBiome);
            
            // Remove the placed biome from both available biomes and current roll
            this.state.availableBiomes.delete(this.state.selectedBiome);
            this.state.currentRollBiomes.delete(this.state.selectedBiome);
            
            this.addJournalEntry(`Placed ${this.state.selectedBiome} at (${q}, ${r})`);
            console.log(`Successfully placed ${this.state.selectedBiome} at q:${q}, r:${r}`);
            
            // Clear selection
            this.state.selectedBiome = null;
            
            // Update display with remaining biomes from current roll
            this.updateBiomeSelection(0); // Pass 0 to indicate this is not a new roll
        }
    }
}

// Handle window resizing
window.addEventListener('resize', () => {
    // Debounce resize event
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        if (window.game) {
            window.game.initializeGrid();
        }
    }, 250);
});

// Create game instance after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, creating game instance...");
    window.game = new Game();
    console.log("Game instance created and stored in window.game");
});