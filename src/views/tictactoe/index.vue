<template>
    <div class="tictactoe-container">
        <div class="game-header">
            <h1 class="game-title">井字棋</h1>
        </div>

        <div class="game-area">
            <div class="board_wrap" :class="{ 'win-animation': gameEnded && gameResultText !== '平局！' }">
                <canvas ref="canvasRef" width="300" height="300"></canvas>
                <div v-if="gameEnded" class="game-result">
                    <div class="result-content" :class="{ win: gameResultText.includes('获胜'), draw: gameResultText === '平局！' }">
                        <div class="result-icon" v-if="gameResultText.includes('获胜')">
                            <span class="crown">👑</span>
                        </div>
                        <p>{{ gameResultText }}</p>
                        <button class="btn primary-btn" @click="resetGame">再来一局</button>
                    </div>
                </div>
            </div>

            <div class="control-panel">
                <div class="turn-display">
                    <div class="turn-label">当前回合</div>
                    <div class="turn-piece" :class="isWhiteTurn ? 'white-piece' : 'black-piece'">
                        <span class="piece-glow"></span>
                    </div>
                </div>

                <div class="btn-group">
                    <button class="btn primary-btn" @click="resetGame">重新开始</button>
                    <router-link to="/games" class="btn secondary-btn">返回列表</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useBoard } from './useBoard';
import { Color } from './enum';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const { gameEnded, gameResultText, resetGame, setCanvasRef, currentColor } = useBoard();

const isWhiteTurn = computed(() => {
    return currentColor.value === Color.WHITE;
});

onMounted(() => {
    if (canvasRef.value) {
        setCanvasRef(canvasRef.value);
    }
});
</script>

<style scoped lang="scss">
@use '../../css/media.scss' as *;
@use '../../css/mixin.scss' as *;

.tictactoe-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;

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
    width: 320px;
    height: 320px;
    background-color: var(--mainBgColor);
    border-radius: 12px;
    @include flexCenter();
    position: relative;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--borderMainColor);
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;

    @include respond-to('small') {
        width: 280px;
        height: 280px;
    }

    &.win-animation {
        animation: winPulse 1.5s infinite alternate;
        box-shadow: 0 8px 24px rgba(var(--textHoverColorRGB), 0.4);
    }

    canvas {
        width: 300px;
        height: 300px;

        @include respond-to('small') {
            width: 260px;
            height: 260px;
        }
    }
}

.control-panel {
    width: 100%;
    max-width: 320px;
    @include flexColumn();
    gap: 20px;

    @include respond-to('small') {
        max-width: 280px;
    }
}

.turn-display {
    background-color: var(--secBgColor);
    border-radius: 12px;
    padding: 16px;
    @include flexCenter();
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--textHoverColor), transparent);
        opacity: 0.7;
    }

    .turn-label {
        font-size: 16px;
        font-weight: 500;
        color: var(--textMainColor);
    }

    .turn-piece {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        position: relative;

        .piece-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            border-radius: 50%;
            z-index: -1;
            animation: glowPulse 1.5s infinite alternate;
        }

        &.white-piece {
            background-color: #ffffff;
            border: 2px solid #000000;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);

            .piece-glow {
                background: radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 70%);
            }
        }

        &.black-piece {
            background-color: #000000;
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);

            .piece-glow {
                background: radial-gradient(circle, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 70%);
            }
        }
    }
}

.btn-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.btn {
    padding: 12px 0;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    border: none;

    &:active {
        transform: translateY(2px);
    }
}

.primary-btn {
    background-color: var(--textHoverColor);
    color: #ffffff;
    position: relative;
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(60deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transform: rotate(45deg);
        transition: all 0.3s;
        opacity: 0;
    }

    &:hover {
        filter: brightness(1.1);

        &::after {
            left: 100%;
            opacity: 1;
        }
    }
}

.secondary-btn {
    background-color: var(--secBgColor);
    color: var(--textMainColor);
    border: 1px solid var(--borderMainColor);
    text-decoration: none;

    &:hover {
        background-color: var(--hoverBgColor);
    }
}

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

        &.win {
            border-top: 4px solid var(--textHoverColor);
        }

        &.draw {
            border-top: 4px solid #888888;
        }

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

@keyframes winPulse {
    0% {
        box-shadow: 0 6px 16px rgba(var(--textHoverColorRGB), 0.4);
    }
    100% {
        box-shadow: 0 8px 28px rgba(var(--textHoverColorRGB), 0.8);
    }
}

@keyframes glowPulse {
    0% {
        opacity: 0.4;
        transform: translate(-50%, -50%) scale(1);
    }
    100% {
        opacity: 0.8;
        transform: translate(-50%, -50%) scale(1.3);
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
</style>
