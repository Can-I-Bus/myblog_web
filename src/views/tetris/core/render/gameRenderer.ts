import GAME_CONFIG from '../../config/game.config';
import BTNS_CONFIG from '../../config/btns.config';
import { RenderUtils } from '../../utils/renderUtils';
import { IGameRenderer } from '../interfaces/IGameRenderer';
import { GameStatus } from '../enums/gameStatus.enum';
import { ButtonPosType } from '../enums/btn.enum';
const { squareSize, gameColumnNum, gameRowNum, dpr, offset, boardBorderWidth, interval, nextShapeSectionRowNum, nextShapeSectionColumnNum, gameWidth } = GAME_CONFIG;

type GameRenderType = {
    canvasEl: HTMLCanvasElement;
    canvasCtx: CanvasRenderingContext2D;
};

export class GameRenderer implements IGameRenderer {
    private _canvas: HTMLCanvasElement | null = null;
    private _ctx: CanvasRenderingContext2D | null = null;
    private _renderUtils: RenderUtils | null = null;
    private _score: number = 0;
    private _level: number = 1;
    private _speed: number = interval; // 使用配置中的初始间隔
    private _gameStatus: GameStatus = GameStatus.playing; // 游戏状态

    constructor(renderObj: GameRenderType) {
        const { canvasEl, canvasCtx } = renderObj;
        this._canvas = canvasEl;
        this._ctx = canvasCtx;
        this._canvas.width = this._canvas.width * dpr;
        this._canvas.height = this._canvas.height * dpr;
        this._ctx.scale(dpr, dpr);
        this._renderUtils = new RenderUtils(this._ctx);
    }

    /**
     * 设置游戏状态
     */
    setGameStatus(status: GameStatus): void {
        this._gameStatus = status;
        // 重新渲染按钮区域
        this.drawActionSection();
    }

    /**
     * 获取游戏状态
     */
    getGameStatus(): GameStatus {
        return this._gameStatus;
    }

    /**
     * 按移除方块数更新得分
     * @param removedSquareCount 移除的方块数量
     */
    updateScore(removedSquareCount: number): void {
        if (removedSquareCount > 0) {
            // 按移除的方块数计分：1个方块 = 1分
            this._score += removedSquareCount;

            // 每100分升一级
            const newLevel = Math.floor(this._score / 100) + 1;
            if (newLevel > this._level) {
                this._level = newLevel;
                // 更新速度：每级减少100毫秒，最低200毫秒
                this._speed = Math.max(200, interval - (this._level - 1) * 100);
            }

            // 重新绘制得分区域
            this.drawScoreboardSection();
        }
    }

    /**
     * 获取当前游戏速度
     */
    getSpeed(): number {
        return this._speed;
    }

    /**
     * 获取当前得分
     */
    getScore(): number {
        return this._score;
    }

    /**
     * 获取当前等级
     */
    getLevel(): number {
        return this._level;
    }

    /**
     * 重置游戏数据
     */
    resetGame(): void {
        this._score = 0;
        this._level = 1;
        this._speed = interval;
        this.drawScoreboardSection();
    }

    /**
     * 绘制游戏主区域
     */
    private drawMainSection(): void {
        if (!this._renderUtils) return;
        const lineColor = '#e0e0e0'; // 使用固定颜色
        const boardBorderColor = '#cccccc'; // 使用固定颜色
        const mainSectionBgc = '#f8f9fa'; // 使用固定颜色
        this._renderUtils.drawRect({
            x: offset - boardBorderWidth / 2,
            y: offset - boardBorderWidth / 2,
            w: squareSize * gameColumnNum + boardBorderWidth,
            h: squareSize * gameRowNum + boardBorderWidth,
            stokeColor: boardBorderColor,
            lineWidth: boardBorderWidth,
            fillColor: mainSectionBgc,
        });

        for (let i = 0; i < gameRowNum; i++) {
            const drawLineObj = {
                startX: offset,
                startY: offset + squareSize * i,
                endX: offset + squareSize * gameColumnNum,
                endY: offset + squareSize * i,
                color: lineColor,
                lineWidth: 0.6,
            };
            this._renderUtils.drawLine(drawLineObj);
        }
        for (let i = 0; i < gameColumnNum; i++) {
            const drawLineObj = {
                startX: offset + squareSize * i,
                startY: offset,
                endX: offset + squareSize * i,
                endY: offset + squareSize * gameRowNum,
                color: lineColor,
                lineWidth: 0.6,
            };
            this._renderUtils.drawLine(drawLineObj);
        }
    }

    /**
     * 绘制游戏下一个图形展示区域
     */
    private drawNextShareSection(): void {
        if (!this._ctx) return;
        const fillColor = '#f1f3f5'; // 使用固定颜色
        this._renderUtils?.drawRadiusRect({
            x: offset + squareSize * gameColumnNum + offset,
            y: offset,
            w: squareSize * nextShapeSectionColumnNum,
            h: squareSize * nextShapeSectionRowNum,
            lineColor: 'transparent',
            lineWidth: 0.1,
            radius: 10,
            fillColor,
        });
    }

    /**
     * 绘制得分区域
     */
    private drawScoreboardSection(): void {
        if (!this._renderUtils || !this._ctx) return;

        const color = '#495057'; // 使用固定颜色
        const backgroundColor = '#f8f9fa'; // 使用固定颜色

        // 计算右侧空间的居中位置
        const mainBoardRightX = offset + squareSize * gameColumnNum;
        const rightSectionWidth = gameWidth - mainBoardRightX;
        const centerX = mainBoardRightX + rightSectionWidth / 2;

        // 得分区域的起始Y位置
        const scoreStartY = offset + squareSize * nextShapeSectionRowNum + 40;
        const sectionHeight = 180;

        // 清除得分区域背景
        this._ctx.clearRect(mainBoardRightX + 5, scoreStartY - 20, rightSectionWidth - 10, sectionHeight);

        // 绘制得分区域背景
        this._renderUtils.drawRadiusRect({
            x: mainBoardRightX + 10,
            y: scoreStartY - 15,
            w: rightSectionWidth - 20,
            h: sectionHeight - 10,
            lineColor: '#dddddd', // 使用固定颜色
            lineWidth: 1,
            radius: 8,
            fillColor: backgroundColor,
        });

        // 绘制得分信息
        const textItems = [
            { label: '得分', value: this._score.toLocaleString(), y: scoreStartY + 20 },
            { label: '等级', value: this._level.toString(), y: scoreStartY + 70 },
        ];

        textItems.forEach((item) => {
            // 绘制标签
            this._renderUtils?.drawText({
                x: centerX,
                y: item.y,
                color,
                content: item.label,
                fz: '16px',
                textAlign: 'center',
                textBaseline: 'middle',
            });

            // 绘制数值
            this._renderUtils?.drawText({
                x: centerX,
                y: item.y + 25,
                color: '#212529', // 使用固定颜色
                content: item.value,
                fz: '18px',
                textAlign: 'center',
                textBaseline: 'middle',
            });
        });
    }

    /**
     * 绘制操作区域
     */
    private async drawActionSection(): Promise<void> {
        if (!this._renderUtils) return;

        // 按钮背景和边框颜色
        const buttonBgColor = '#f0f0f0'; // 使用固定颜色
        const buttonBorderColor = '#cccccc'; // 使用固定颜色
        const buttonRadius = 12; // 圆角半径

        // 使用Promise.all等待所有图片加载完成
        await Promise.all(
            BTNS_CONFIG.map(async (button) => {
                // 先绘制按钮背景（圆角矩形）
                this._renderUtils?.drawRadiusRect({
                    x: button.left,
                    y: button.top,
                    w: button.width,
                    h: button.height,
                    radius: buttonRadius,
                    fillColor: buttonBgColor,
                    lineColor: buttonBorderColor,
                    lineWidth: 1,
                });

                // 根据按钮类型和游戏状态设置不同的图片
                let imageSrc = button.imageBaseSrc;
                if (button.name === ButtonPosType.pause) {
                    // 根据游戏状态显示不同图标
                    imageSrc =
                        this._gameStatus === GameStatus.pause
                            ? 'public/games/start.png' // 暂停时显示开始图标
                            : 'public/games/Pause.png'; // 游戏中显示暂停图标
                }

                // 创建并加载图片
                const img = await this.loadImage('../../../../../' + imageSrc);

                // 计算图片在按钮中的居中位置
                const imgX = button.left + button.imageOffsetX;
                const imgY = button.top + button.imageOffsetY;

                // 绘制图片
                this._renderUtils?.drawImg({
                    image: img,
                    dx: imgX,
                    dy: imgY,
                    dWidth: button.imageSize,
                    dHeight: button.imageSize,
                });
            })
        );
    }

    /**
     * 加载图片并返回一个Promise
     * @param src 图片路径
     */
    private loadImage(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    async render(): Promise<void> {
        this.drawMainSection();
        this.drawNextShareSection();
        this.drawScoreboardSection();
        await this.drawActionSection();
    }

    clear(): void {
        throw new Error('Method not implemented.');
    }
}
