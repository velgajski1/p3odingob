// Game state types
export enum GameState
{
    PLAYER_TURN = 'PLAYER_TURN',
    AI_TURN = 'AI_TURN',
    GAME_OVER = 'GAME_OVER'
}

// Score category types
export enum ScoreCategory
{
    ONES = 'ONES',
    TWOS = 'TWOS',
    THREES = 'THREES',
    FOURS = 'FOURS',
    FIVES = 'FIVES',
    SIXES = 'SIXES',
    THREE_OF_A_KIND = 'THREE_OF_A_KIND',
    FOUR_OF_A_KIND = 'FOUR_OF_A_KIND',
    FULL_HOUSE = 'FULL_HOUSE',
    SMALL_STRAIGHT = 'SMALL_STRAIGHT',
    LARGE_STRAIGHT = 'LARGE_STRAIGHT',
    CHANCE = 'CHANCE',
    SUM = 'SUM',
    BONUS = 'BONUS',
    TOTAL = 'TOTAL'
}

// Score row interface
export interface ScoreRow
{
    category: ScoreCategory;
    score: number;
    isUsed: boolean;
    isHighlighted: boolean;
    sprite: Phaser.GameObjects.Container;
    isSumOrBonus?: boolean;
    isTotal?: boolean;
    scoreText: Phaser.GameObjects.Text;
}

// Game statistics interface
export interface GameStats
{
    gamesPlayed: number;
    gamesWon: number;
    currentWinStreak: number;
    longestWinStreak: number;
    topScore: number;
    totalTimePlayed: number;
}

// Game settings interface
export interface GameSettings
{
    soundEnabled: boolean;
    musicEnabled: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
}

// Device type interface
export interface DeviceInfo
{
    isMobile: boolean;
    isPortrait: boolean;
    width: number;
    height: number;
}

// Dice interface
export interface Dice
{
    value: number;
    isHeld: boolean;
    sprite: Phaser.GameObjects.Sprite;
}

// Game configuration interface
export interface GameConfig
{
    width: number;
    height: number;
    backgroundColor: string;
    scene: Phaser.Scene[];
    scale: {
        mode: Phaser.Scale.ScaleModes;
        autoCenter: Phaser.Scale.Center;
    };
}
