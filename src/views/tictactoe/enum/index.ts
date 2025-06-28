export enum Color {
    WHITE = 'white',
    BLACK = 'black',
    NONE = 'none',
}

/**
 * 游戏状态
 * 0: 游戏进行中
 * 1: 黑子胜利
 * 2: 黑子失败
 * 3: 白子胜利
 * 4: 白子失败
 * 5: 平局
 */
export enum GameStatus {
    PLAYING = 0,
    BLACK_WIN = 1,
    BLACK_LOSE = 2,
    WHITE_WIN = 3,
    WHITE_LOSE = 4,
    DRAW = 5,
}
