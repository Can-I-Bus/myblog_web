import { ButtonPosType } from '../enums/btn.enum';
import { IActionManager } from '../interfaces/IActionManager';
import { Shape } from '../shape';
import { Point } from '../types';
import GAME_CONFIG from '../../config/game.config';
import BUTTON_CONFIG from '../../config/btns.config';
const { gameHeight, squareSize, gameWidth } = GAME_CONFIG;

export class ActionManager implements IActionManager {
    private _canvas: HTMLCanvasElement | null = null;
    private _currShape: Shape | null = null;
    private _onPauseToggle: (() => void) | null = null; // 暂停切换回调
    private _interactionHandler: (e: MouseEvent | TouchEvent) => void;
    private _keyDownHandler: (e: KeyboardEvent) => void;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._interactionHandler = this.handleClick.bind(this);
        this._keyDownHandler = this.handleKeyDown.bind(this);
        this.bindEvent();
    }

    /**
     * 设置暂停切换回调
     */
    setOnPauseToggle(callback: () => void): void {
        this._onPauseToggle = callback;
    }

    private handleClick(e: MouseEvent | TouchEvent) {
        e.preventDefault();
        if (!this._canvas) return;

        const rect = this._canvas.getBoundingClientRect();
        let x, y;

        if (e instanceof MouseEvent) {
            x = e.clientX;
            y = e.clientY;
        } else {
            if (e.changedTouches.length === 0) return;
            x = e.changedTouches[0].clientX;
            y = e.changedTouches[0].clientY;
        }

        // Scale click coordinates from display size (rect.width) to logical game size (gameWidth)
        const scaleX = gameWidth / rect.width;
        const scaleY = gameHeight / rect.height;

        const clickPos = {
            x: (x - rect.left) * scaleX,
            y: (y - rect.top) * scaleY,
        };

        const btnType = this.getClickBtntype(clickPos);

        if (btnType === ButtonPosType.pause) {
            if (this._onPauseToggle) {
                this._onPauseToggle();
            }
            return;
        }

        if (!this._currShape) return;
        let shapeCenterPoint = this._currShape.getCenterPoint() as Point;
        switch (btnType) {
            case ButtonPosType.up:
                this._currShape.rotate();
                break;
            case ButtonPosType.right:
                shapeCenterPoint.x += squareSize;
                this._currShape.setCenterPoint(shapeCenterPoint);
                break;
            case ButtonPosType.down:
                shapeCenterPoint.y += squareSize;
                this._currShape.setCenterPoint(shapeCenterPoint);
                break;
            case ButtonPosType.left:
                shapeCenterPoint.x -= squareSize;
                this._currShape.setCenterPoint(shapeCenterPoint);
                break;
            case ButtonPosType.drop:
                this._currShape.hardDrop();
                break;
        }
    }

    private handleKeyDown(e: KeyboardEvent) {
        if (!this._currShape) return;
        const { code } = e;

        // 阻止浏览器默认行为，防止方向键和空格键滚动页面
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code)) {
            e.preventDefault();
        }

        let shapeCenterPoint = this._currShape.getCenterPoint() as Point;
        switch (code) {
            // 如果是向上类型的话，需要变化图形
            case 'ArrowUp':
                this._currShape.rotate();
                break;
            case 'ArrowRight':
                shapeCenterPoint.x += squareSize;
                this._currShape.setCenterPoint(shapeCenterPoint);
                break;
            case 'ArrowDown':
                shapeCenterPoint.y += squareSize;
                this._currShape.setCenterPoint(shapeCenterPoint);
                break;
            case 'ArrowLeft':
                shapeCenterPoint.x -= squareSize;
                this._currShape.setCenterPoint(shapeCenterPoint);
                break;
            case 'Space':
                this._currShape.hardDrop();
                break;
        }
    }

    /**
     * 获取点击的按钮类型
     * @param clickPos 鼠标点击的坐标
     * @returns ButtonPosType 按钮类型
     */
    private getClickBtntype(clickPos: Point): ButtonPosType | null {
        for (const btn of BUTTON_CONFIG) {
            if (clickPos.x >= btn.left && clickPos.x <= btn.right && clickPos.y >= btn.top && clickPos.y <= btn.top + btn.height) {
                return btn.name;
            }
        }
        return null;
    }

    setCurrShape(shape: Shape) {
        this._currShape = shape;
    }

    getCurrShape(): Shape | null {
        return this._currShape;
    }

    bindEvent(): void {
        this._canvas?.addEventListener('click', this._interactionHandler);
        this._canvas?.addEventListener('touchend', this._interactionHandler);
        window.addEventListener('keydown', this._keyDownHandler);
    }

    destoryEvent(): void {
        this._canvas?.removeEventListener('click', this._interactionHandler);
        this._canvas?.removeEventListener('touchend', this._interactionHandler);
        window.removeEventListener('keydown', this._keyDownHandler);
    }
}
