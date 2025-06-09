// import { GameManager } from "../managers/GameManager";
// import gamema

export const BACKGROUND_COLORS = [
    '#417652',
    '#367a37', '#37864f', '#226632', '#014001', '#3b403c',
    '#3d444e', '#575759', '#7b5f4a', '#4d5e72', '#616d95',
    '#42678e', '#2d5f80', '#3b7aa6', '#008080', '#2b8063',
    '#428e7f', '#5a8495', '#8a8697', '#b1aeae'
];

// Define a new constant for stat labels
export const STAT_LABELS = {
    GamesPlayed: 'Games Played',
    GamesWon: 'Games Won',
    GamesLost: 'Games Lost',
    WinPercentage: 'Win Percentage',
    CurrentWinStreak: 'Current Win Streak',
    LongestWinStreak: 'Longest Win Streak',
    AverageTime: 'Avg. Time/Game',
    LowestScore: 'Lowest Score',
    TopScore: 'Top Score',
    BestTime: 'Best Time',
};

export enum PileType
{
    Tableau = 'Tableau',
    Foundation = 'Foundation',
    Stock = 'Stock',
    Transition = 'Transition',
    Waste = 'Waste',
}

export const getCardScale = () =>
{
    // Replace `condition` with your actual condition logic

    if (innerWidth > innerHeight)
    {
        return CARD_SCALE_SMALLER_SCREEN; // Return a smaller scale for specific cases
    } else
    {
        return CARD_SCALE; // Default scale
    }
};

// Utility function to check if device is mobile
const isMobileDevice = (): boolean =>
{
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|iphone|ipod/.test(userAgent) && !/ipad/.test(userAgent);
};

export const getStockCoordsY = () =>
{
    if (isMobileDevice()) return STOCK_COORDS.y_mobile;
    return STOCK_COORDS.y;
}

export const getTabCoordsY = () =>
{
    if (isMobileDevice()) return TABLEU_COORDS_INIT.y_mobile;
    return TABLEU_COORDS_INIT.y;
}

export const CARD_SCALE = 0.51;
export const CARD_SCALE_SMALLER_SCREEN = 0.51

export const COMPLETE_SEQUENCE_DELAY = 400;

export const STOCK_COORDS = { x: [-60 + 2 - 7 + 2, 95 + 2 - 7 + 2], y: 430 + 7 + 10, y_mobile: 447 + 20 };
export const STOCK_COORDS_DELTA_X = 13;
export const FOUNDATION_COORDS_INIT = { x: [STOCK_COORDS.x[0] + 980 + 13, STOCK_COORDS.x[1] - 921], y: 80 }
export const FOUNDATION_COORDS_DELTA = { x: [106, -106], y: 0 }
export const CARD_MOVE_BEFORE_DRAG_ACTIVE = 3;
export const CARD_MOVE_BEFORE_DRAG_AND_DROP = 100;
export const TABLEU_STACK_TWEEN_DURATION = 250;
export const TABLEU_TABLUEU_TWEEN_DURATION = 300;
export const DISABLE_CLICK_DURATION_NORMAL = 40
export const DISABLE_CLICK_DURATION_STOCK = 60;
export const DISABLE_STOCK_DISTRIBUTION = 800;
export const TABLEU_FOLD_HEIGHT = 700;
export const FOLD_PIXELS_RATE = 20;
export const HINT_OVERLAY_DURATION = 600
export const HINT_NEXT_OVERLAY_DELTA = 250;
export const TAB_DELTA_Y_MOBILE_EXTRA = 6;
export const STOCK_WASTE_SCALE = 1;
export const GAME_ROW_SPACING = { x: 110, y: 40 };
export const GAME_START_X = -455 + 2
export const GAME_START_Y = 100;
export const WASTE_OFFSET_X = 126
export const FOUNDATION_OFFSET_X = 420 + 13 - 4 + 1;
export const TABLEU_COORDS_INIT = { x: GAME_START_X, y: 100 + 7, y_mobile: 90 }
export const TABLEU_COORDS_DELTA = { x: 100, y: 37, y_covered: 44 }
