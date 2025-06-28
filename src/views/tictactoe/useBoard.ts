import { ref, computed, onUnmounted } from 'vue';
import { Color, GameStatus } from './enum';

type Position = {
    x: number;
    y: number;
};

type DrawLine = Position[];

type AnimationState = {
    active: boolean;
    position: Position;
    color: Color;
    progress: number;
    startTime: number;
};

export function useBoard() {
    // 棋盘状态
    const canvas = ref<HTMLCanvasElement | null>(null);
    const ctx = ref<CanvasRenderingContext2D | null>(null);
    const boardSize = ref(300);
    const cellSize = ref(100);
    const dpr = ref(window.devicePixelRatio || 1);
    const gameStatus = ref<GameStatus>(GameStatus.PLAYING);
    const currentColor = ref<Color>(Color.WHITE);

    // 棋盘数据
    const boardData = ref<Array<Array<Color | null>>>([
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ]);
    const lineData = ref<DrawLine[]>([]);
    const gameEnded = computed(() => {
        return gameStatus.value !== GameStatus.PLAYING;
    });

    // 动画状态
    const animationState = ref<AnimationState>({
        active: false,
        position: { x: 0, y: 0 },
        color: Color.WHITE,
        progress: 0,
        startTime: 0,
    });
    const animationDuration = 600; // 增加动画持续时间（毫秒）
    let animationFrameId: number | null = null;

    const gameResultText = computed(() => {
        switch (gameStatus.value) {
            case GameStatus.WHITE_WIN:
                return '白方获胜！';
            case GameStatus.BLACK_WIN:
                return '黑方获胜！';
            case GameStatus.DRAW:
                return '平局！';
            default:
                return '';
        }
    });

    // 初始化棋盘
    const initBoard = () => {
        if (!canvas.value) return;

        const canvasEl = canvas.value;
        canvasEl.width = boardSize.value * dpr.value;
        canvasEl.height = boardSize.value * dpr.value;

        ctx.value = canvasEl.getContext('2d');

        if (ctx.value) {
            // 设置线条抗锯齿
            ctx.value.imageSmoothingEnabled = true;
            ctx.value.imageSmoothingQuality = 'high';
        }

        // 初始化棋盘数据
        boardData.value = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ];

        // 设置线条数据
        lineData.value = [
            [
                { x: cellSize.value * dpr.value, y: 0 },
                { x: cellSize.value * dpr.value, y: boardSize.value * dpr.value },
            ],
            [
                { x: cellSize.value * 2 * dpr.value, y: 0 },
                { x: cellSize.value * 2 * dpr.value, y: boardSize.value * dpr.value },
            ],
            [
                { x: 0, y: cellSize.value * dpr.value },
                { x: boardSize.value * dpr.value, y: cellSize.value * dpr.value },
            ],
            [
                { x: 0, y: cellSize.value * 2 * dpr.value },
                { x: boardSize.value * dpr.value, y: cellSize.value * 2 * dpr.value },
            ],
        ];
        drawBoard();
        canvasEl.addEventListener('click', handleClick);
    };

    const drawBoard = () => {
        if (!ctx.value) return;

        // 清除画布
        ctx.value.clearRect(0, 0, boardSize.value * dpr.value, boardSize.value * dpr.value);

        // 绘制棋盘背景
        ctx.value.fillStyle = '#f5f5f5';
        ctx.value.fillRect(0, 0, boardSize.value * dpr.value, boardSize.value * dpr.value);

        // 绘制网格线
        lineData.value.forEach((line) => drawLine(line));

        // 绘制所有已放置的棋子，但跳过正在动画的棋子
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const color = boardData.value[i][j];
                if (color !== null) {
                    const centerPos = getChessDrawPos({ x: i, y: j });

                    // 检查是否是当前正在动画的棋子
                    const animatingPos = getChessPosition(animationState.value.position);
                    const isAnimating = animationState.value.active && i === animatingPos.x && j === animatingPos.y;

                    // 如果不是正在动画的棋子，才绘制
                    if (!isAnimating) {
                        drawChess(centerPos, color, 1); // 1表示完全显示
                    }
                }
            }
        }
    };

    // 绘制线条
    const drawLine = (line: DrawLine) => {
        if (!ctx.value) return;
        ctx.value.beginPath();
        ctx.value.lineWidth = 4;
        ctx.value.strokeStyle = '#666666';
        ctx.value.moveTo(line[0].x, line[0].y);
        ctx.value.lineTo(line[1].x, line[1].y);
        ctx.value.stroke();
    };

    // 绘制棋子
    const drawChess = (centerPos: Position, color: Color, alpha: number = 1) => {
        if (!ctx.value) return;

        // 从0开始变大到最终大小
        const finalRadius = 30;
        const radius = finalRadius * alpha;

        // 保存当前绘图状态
        ctx.value.save();

        // 绘制棋子底色
        ctx.value.beginPath();
        ctx.value.arc(centerPos.x, centerPos.y, radius, 0, 2 * Math.PI);
        ctx.value.fillStyle = color === Color.WHITE ? '#ffffff' : '#000000';
        ctx.value.fill();

        // 为白色棋子添加黑色边框，提高可见性
        if (color === Color.WHITE) {
            ctx.value.lineWidth = 2 * alpha;
            ctx.value.strokeStyle = '#000000';
            ctx.value.stroke();

            // 添加内部阴影效果
            if (radius > 4) {
                // 防止半径太小时出现问题
                ctx.value.beginPath();
                ctx.value.arc(centerPos.x, centerPos.y, radius - 4 * alpha, 0, 2 * Math.PI);
                ctx.value.strokeStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.value.stroke();
            }
        } else {
            // 为黑色棋子添加光泽效果
            if (radius > 2) {
                // 防止半径太小时出现问题
                const gradient = ctx.value.createRadialGradient(centerPos.x - radius * 0.3, centerPos.y - radius * 0.3, radius * 0.1, centerPos.x, centerPos.y, radius);
                gradient.addColorStop(0, 'rgba(100, 100, 100, 0.8)');
                gradient.addColorStop(1, '#000000');

                ctx.value.beginPath();
                ctx.value.arc(centerPos.x, centerPos.y, radius - 2 * alpha, 0, 2 * Math.PI);
                ctx.value.fillStyle = gradient;
                ctx.value.fill();
            }
        }

        // 添加扩散波纹效果
        if (alpha < 1) {
            // 绘制扩散波纹
            const waveProgress = easeOutQuad(alpha); // 使用二次缓动
            const ringRadius = finalRadius * (1 + 0.5 * (1 - waveProgress));

            ctx.value.beginPath();
            ctx.value.arc(centerPos.x, centerPos.y, ringRadius, 0, 2 * Math.PI);
            ctx.value.strokeStyle = color === Color.WHITE ? `rgba(255, 255, 255, ${0.5 * (1 - alpha)})` : `rgba(0, 0, 0, ${0.4 * (1 - alpha)})`;
            ctx.value.lineWidth = 2 * (1 - alpha);
            ctx.value.stroke();

            // 添加第二层波纹
            const outerRingRadius = finalRadius * (1 + 0.8 * (1 - Math.pow(waveProgress, 2)));
            ctx.value.beginPath();
            ctx.value.arc(centerPos.x, centerPos.y, outerRingRadius, 0, 2 * Math.PI);
            ctx.value.strokeStyle = color === Color.WHITE ? `rgba(255, 255, 255, ${0.3 * (1 - alpha)})` : `rgba(0, 0, 0, ${0.2 * (1 - alpha)})`;
            ctx.value.lineWidth = 1.5 * (1 - alpha);
            ctx.value.stroke();
        }

        // 恢复绘图状态
        ctx.value.restore();
    };

    // 动画循环
    const animateChess = (timestamp: number) => {
        if (!ctx.value || !animationState.value.active) return;

        if (animationState.value.startTime === 0) {
            animationState.value.startTime = timestamp;
        }

        const elapsed = timestamp - animationState.value.startTime;

        // 使用缓动函数使动画更自然
        const progress = Math.min(elapsed / animationDuration, 1);
        animationState.value.progress = easeOutBack(progress); // 使用弹性缓动效果

        // 重绘棋盘
        drawBoard();

        // 绘制动画中的棋子
        drawChess(animationState.value.position, animationState.value.color, animationState.value.progress);

        // 如果动画未完成，继续请求下一帧
        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animateChess);
        } else {
            // 动画结束
            animationState.value.active = false;
            animationState.value.startTime = 0;

            // 检查是否有玩家获胜
            checkWin();

            // 如果没有获胜者，切换玩家
            if (gameStatus.value === GameStatus.PLAYING) {
                currentColor.value = currentColor.value === Color.WHITE ? Color.BLACK : Color.WHITE;
            }
        }
    };

    // 缓动函数：缓出二次方
    const easeOutQuad = (x: number): number => {
        return 1 - Math.pow(1 - x, 2);
    };

    // 缓动函数：弹性缓出
    const easeOutBack = (x: number): number => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    };

    // 开始棋子放置动画
    const startChessAnimation = (position: Position, color: Color) => {
        // 设置动画状态
        animationState.value = {
            active: true,
            position,
            color,
            progress: 0,
            startTime: 0,
        };

        // 开始动画
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(animateChess);
    };

    const handleClick = (e: MouseEvent) => {
        if (!canvas.value || gameStatus.value !== GameStatus.PLAYING || animationState.value.active) return;
        const { clientX, clientY } = e;
        const canvasRect = canvas.value.getBoundingClientRect();
        const x = clientX - canvasRect.left;
        const y = clientY - canvasRect.top;

        // 计算点击的格子位置
        const cellPos = {
            x: Math.floor(y / cellSize.value),
            y: Math.floor(x / cellSize.value),
        };

        // 如果该位置已经有棋子，不做任何操作
        if (boardData.value[cellPos.x][cellPos.y] !== null) return;

        // 更新棋盘数据
        boardData.value[cellPos.x][cellPos.y] = currentColor.value;

        // 开始棋子放置动画
        startChessAnimation(getChessDrawPos(cellPos), currentColor.value);
    };

    // 计算棋子绘制位置
    const getChessDrawPos = (cellPos: Position): Position => {
        return {
            x: (cellPos.y * cellSize.value + cellSize.value / 2) * dpr.value,
            y: (cellPos.x * cellSize.value + cellSize.value / 2) * dpr.value,
        };
    };

    // 从绘制坐标获取棋盘位置
    const getChessPosition = (drawPos: Position): Position => {
        return {
            x: Math.floor(drawPos.y / (cellSize.value * dpr.value)),
            y: Math.floor(drawPos.x / (cellSize.value * dpr.value)),
        };
    };

    // 检查是否有玩家获胜
    const checkWin = () => {
        // 检查行
        for (let i = 0; i < 3; i++) {
            if (boardData.value[i][0] !== null && boardData.value[i][0] === boardData.value[i][1] && boardData.value[i][1] === boardData.value[i][2]) {
                gameStatus.value = boardData.value[i][0] === Color.WHITE ? GameStatus.WHITE_WIN : GameStatus.BLACK_WIN;
                return true;
            }
        }

        // 检查列
        for (let j = 0; j < 3; j++) {
            if (boardData.value[0][j] !== null && boardData.value[0][j] === boardData.value[1][j] && boardData.value[1][j] === boardData.value[2][j]) {
                gameStatus.value = boardData.value[0][j] === Color.WHITE ? GameStatus.WHITE_WIN : GameStatus.BLACK_WIN;
                return true;
            }
        }

        // 检查主对角线
        if (boardData.value[0][0] !== null && boardData.value[0][0] === boardData.value[1][1] && boardData.value[1][1] === boardData.value[2][2]) {
            gameStatus.value = boardData.value[0][0] === Color.WHITE ? GameStatus.WHITE_WIN : GameStatus.BLACK_WIN;
            return true;
        }

        // 检查副对角线
        if (boardData.value[0][2] !== null && boardData.value[0][2] === boardData.value[1][1] && boardData.value[1][1] === boardData.value[2][0]) {
            gameStatus.value = boardData.value[0][2] === Color.WHITE ? GameStatus.WHITE_WIN : GameStatus.BLACK_WIN;
            return true;
        }

        // 检查是否平局（棋盘已满）
        let isFull = true;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (boardData.value[i][j] === null) {
                    isFull = false;
                    break;
                }
            }
            if (!isFull) break;
        }

        if (isFull) {
            gameStatus.value = GameStatus.DRAW;
            return true;
        }

        return false;
    };

    // 重置游戏
    const resetGame = () => {
        if (!ctx.value || !canvas.value) return;

        // 取消任何正在进行的动画
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        // 重置动画状态
        animationState.value = {
            active: false,
            position: { x: 0, y: 0 },
            color: Color.WHITE,
            progress: 0,
            startTime: 0,
        };

        // 清除画布
        ctx.value.clearRect(0, 0, boardSize.value * dpr.value, boardSize.value * dpr.value);

        // 重置棋盘数据
        boardData.value = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ];

        // 重置游戏状态
        currentColor.value = Color.WHITE;
        gameStatus.value = GameStatus.PLAYING;

        // 重新绘制棋盘
        drawBoard();
    };

    const setCanvasRef = (el: HTMLCanvasElement) => {
        if (el) {
            canvas.value = el;
            initBoard();
        }
    };

    onUnmounted(() => {
        // 取消动画
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        // 移除事件监听
        if (canvas.value) {
            canvas.value.removeEventListener('click', handleClick);
        }
    });

    return {
        canvas,
        gameStatus,
        gameEnded,
        gameResultText,
        resetGame,
        setCanvasRef,
        currentColor,
    };
}
