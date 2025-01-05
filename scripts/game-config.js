// Game Configuration
const CONFIG = {
    BOARD_SIZE: 4,
    BIOME_COLORS: {
        'Tropical Rainforest': '#228B22',
        'Savanna': '#DAA520',
        'Desert': '#F4A460',
        'Chaparral': '#BDB76B',
        'Temperate Grassland': '#90EE90',
        'Temperate Forest': '#228B22',
        'Boreal Forest (Taiga)': '#006400',
        'Tundra': '#F0F8FF',
        'Polar Ice': '#E0FFFF',
        'Freshwater Lakes': '#4682B4',
        'Rivers/Streams': '#87CEEB',
        'Wetlands': '#8FBC8F',
        'Open Ocean': '#000080',
        'Coral Reefs': '#FF69B4',
        'Intertidal Zone': '#20B2AA',
        'Estuaries': '#5F9EA0',
        'Deep Sea': '#191970',
        'Mangrove Forest': '#2F4F4F'
    },
    
    ADJACENCY_RULES: {
        "Tropical Rainforest": ["Savanna", "Mangrove Forest", "Tropical Wetlands"],
        "Savanna": ["Tropical Rainforest", "Desert", "Temperate Grassland"],
        "Desert": ["Savanna", "Temperate Grassland", "Chaparral", "Oasis"],
        "Chaparral": ["Desert", "Temperate Forest", "Coastal Zones"],
        "Temperate Grassland": ["Desert", "Temperate Forest", "Boreal Forest", "Savanna"],
        "Temperate Forest": ["Temperate Grassland", "Boreal Forest", "Chaparral", "Freshwater Lakes"],
        "Boreal Forest (Taiga)": ["Temperate Forest", "Tundra"],
        "Tundra": ["Boreal Forest", "Polar Ice"],
        "Polar Ice": ["Tundra", "Polar Oceans"],
        "Freshwater Lakes": ["Temperate Forest", "Boreal Forest", "Grasslands", "Wetlands"],
        "Rivers/Streams": [], // Special case: can connect to any terrestrial biome
        "Wetlands": ["Tropical Rainforest", "Temperate Forest", "Grasslands"],
        "Open Ocean": ["Coastal Zones", "Coral Reefs", "Polar Oceans"],
        "Coral Reefs": ["Open Ocean", "Tropical Coastal Zones"],
        "Intertidal Zone": ["Coastal Zones", "Estuaries"],
        "Estuaries": ["Rivers", "Intertidal Zone", "Open Ocean"],
        "Deep Sea": ["Open Ocean"],
        "Mangrove Forest": ["Tropical Rainforest", "Estuaries", "Coastal Zones"]
    },
    
    HEX_DIRECTIONS: [
        [1, 0], [1, -1], [0, -1],
        [-1, 0], [-1, 1], [0, 1]
    ]
};