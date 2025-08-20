<template>
    <div class="tetris-container" @keydown.prevent>
        <div class="game-header">
            <h1 class="game-title">俄罗斯方块</h1>
        </div>

        <div class="game-area" @keydown.prevent>
            <div class="board_wrap" :class="{ 'game-over-animation': isGameOver }" @keydown.prevent>
                <canvas ref="gameCanvas" width="350" height="650" class="game-canvas" tabindex="0" @keydown.prevent></canvas>

                <!-- 游戏结束蒙层 -->
                <div v-if="isGameOver" class="game-result">
                    <div class="result-content">
                        <div class="result-icon">
                            <span class="crown">👑</span>
                        </div>
                        <p>游戏结束！</p>
                        <button class="btn primary-btn" @click="restartGame">再来一局</button>
                    </div>
                </div>
            </div>

            <div class="control-panel">
                <div class="btn-group">
                    <router-link to="/games" class="btn secondary-btn">返回列表</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Game } from './core/game';

const gameCanvas = ref<HTMLCanvasElement | null>(null);

const isGameOver = ref(false);

let gameInstance: Game | null = null;

const startNewGame = () => {
    if (gameCanvas.value) {
        isGameOver.value = false;

        // 销毁现有游戏实例
        if (gameInstance) {
            gameInstance = null;
        }

        // 重置canvas尺寸，防止重复缩放
        gameCanvas.value.width = 350;
        gameCanvas.value.height = 650;

        // 让canvas获得焦点，以便接收键盘事件
        gameCanvas.value.focus();

        // 创建新的游戏实例
        gameInstance = new Game({
            canvasEl: gameCanvas.value,
            onGameOver: () => {
                isGameOver.value = true;
            },
        });
    }
};

const restartGame = () => {
    startNewGame();
};

// 生命周期
onMounted(() => {
    setTimeout(() => {
        startNewGame();
    }, 300);
});

onUnmounted(() => {
    if (gameInstance) {
        gameInstance = null;
    }
});
</script>

<style scoped lang="scss">
@use '../../css/media.scss' as *;
@use '../../css/mixin.scss' as *;

.tetris-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @include respond-to('small') {
        padding: 15px;
    }
}

.game-header {
    text-align: center;
    margin-bottom: 30px;

    .game-title {
        font-size: 32px;
        font-weight: 600;
        color: var(--textMainColor);
        margin: 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        @include respond-to('small') {
            font-size: 28px;
        }
    }
}

.game-area {
    @include flexColumn();
    align-items: center;
    gap: 30px;
}

.board_wrap {
    width: 370px;
    height: 670px;
    background: var(--mainBgColor);
    border-radius: 12px;
    @include flexCenter();
    position: relative;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--borderMainColor);
    overflow: hidden;
    transition: all 0.3s ease;

    @include respond-to('small') {
        width: 330px;
        height: 630px;
    }

    &.game-over-animation {
        animation: gameOverPulse 1.5s infinite alternate;
        box-shadow: 0 8px 24px rgba(var(--textHoverColorRGB), 0.4);
    }
}

.game-canvas {
    width: 350px;
    height: 650px;
    border-radius: 8px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    outline: none; /* 去除焦点轮廓 */

    @include respond-to('small') {
        width: 310px;
        height: 610px;
    }
}

.control-panel {
    width: 100%;
    max-width: 370px;

    @include respond-to('small') {
        max-width: 330px;
    }
}

.btn-group {
    display: flex;
    justify-content: center;
}

.btn {
    padding: 14px 28px;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    border: none;
    text-decoration: none;
    display: inline-block;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
    }

    &:hover::before {
        left: 100%;
    }

    &:active {
        transform: translateY(2px);
    }

    &.primary-btn {
        background: linear-gradient(135deg, var(--textHoverColor) 0%, var(--textHoverSecColor) 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(var(--textHoverColorRGB), 0.4), 0 2px 4px rgba(0, 0, 0, 0.1);

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(var(--textHoverColorRGB), 0.5), 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        &:active {
            transform: translateY(0);
        }
    }

    &.secondary-btn {
        background: var(--secBgColor);
        color: var(--textMainColor);
        border: 2px solid var(--borderMainColor);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

        &:hover {
            background: var(--hoverBgColor);
            border-color: var(--textHoverColor);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        &:active {
            transform: translateY(0);
        }
    }
}

// 游戏结束蒙层
.game-result {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    @include flexCenter();
    z-index: 10;
    animation: fadeIn 0.5s ease-out;

    .result-content {
        background-color: var(--mainBgColor);
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        width: 80%;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        transform: translateY(0);
        animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border-top: 4px solid var(--textHoverColor);

        .result-icon {
            margin-bottom: 15px;

            .crown {
                font-size: 36px;
                display: inline-block;
                animation: float 2s ease-in-out infinite;
            }
        }

        p {
            font-size: 24px;
            font-weight: 600;
            color: var(--textMainColor);
            margin: 0 0 20px;
        }

        .btn {
            width: 100%;
        }
    }
}

// 动画效果
@keyframes gameOverPulse {
    0% {
        box-shadow: 0 8px 24px rgba(var(--textHoverColorRGB), 0.4);
    }
    100% {
        box-shadow: 0 8px 24px rgba(var(--textHoverColorRGB), 0.8);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes popIn {
    0% {
        opacity: 0;
        transform: translateY(20px) scale(0.8);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes float {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

// 响应式优化
@include respond-to('small') {
    .game-area {
        gap: 20px;
    }

    .board_wrap {
        box-shadow: 0 8px 24px rgba(var(--textHoverColorRGB), 0.4);

        &:hover {
            transform: none;
        }
    }

    .btn {
        padding: 12px 24px;
        font-size: 15px;
    }

    .game-result .result-content {
        padding: 20px;
        width: 90%;

        .result-icon .crown {
            font-size: 32px;
        }

        p {
            font-size: 20px;
        }
    }
}
</style>
