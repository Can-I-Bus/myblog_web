<template>
    <div class="games-container">
        <div class="games-header">
            <h1 class="games-title">一些小游戏，持续开发中～</h1>
            <p class="games-subtitle">休闲时光，尽享乐趣</p>
        </div>

        <div class="games-list">
            <div v-for="(game, index) in games" :key="index" class="game-card">
                <div class="game-image-container">
                    <img :src="game.image" :alt="game.title" class="game-image" />
                </div>
                <div class="game-info">
                    <h3 class="game-title">{{ game.title }}</h3>
                    <p class="game-desc">{{ game.description }}</p>
                    <div class="game-actions">
                        <router-link :to="game.link" class="play-button">开始游戏</router-link>
                        <span class="game-tag">{{ game.tag }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const games = ref([
    {
        title: '井字棋',
        description: '经典的井字棋游戏，两人轮流在3×3的网格上放置黑白棋子标记，先形成一条直线者获胜',
        image: '/games/tictactoe.png',
        link: '/tictactoe',
        tag: '简单',
    },
    {
        title: '俄罗斯方块',
        description: '经典的俄罗斯方块游戏，通过移动和旋转方块，避免方块堆积到顶部',
        image: '/games/tetris.png',
        link: '/tetris',
        tag: '中等',
    },
    // {
    //     title: '2048',
    //     description: '合并相同数字的方块，努力达到2048或更高的数值',
    //     image: '/games/2048.png',
    //     link: '/2048',
    //     tag: '中等',
    // },
    // {
    //     title: '贪吃蛇',
    //     description: '控制蛇不断成长，避免碰到自身或墙壁',
    //     image: '/games/snake.png',
    //     link: '/snake',
    //     tag: '简单',
    // },
    // {
    //     title: '记忆游戏',
    //     description: '翻转卡片并记住它们的位置，找出所有匹配的对子',
    //     image: '/games/memory.png',
    //     link: '/memory',
    //     tag: '中等',
    // },
]);
</script>

<style scoped lang="scss">
@use '@/css/mixin.scss' as *;
@use '@/css/media.scss' as *;

.games-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;

    @include respond-to('small') {
        padding: 16px;
    }
}

.games-header {
    text-align: center;
    margin-bottom: 40px;

    @include respond-to('small') {
        margin-bottom: 24px;
    }
}

.games-title {
    font-size: 36px;
    color: var(--textMainColor);
    margin: 0 0 8px;
    font-weight: 600;

    @include respond-to('small') {
        font-size: 28px;
    }
}

.games-subtitle {
    font-size: 18px;
    color: var(--textSecColor);
    margin: 0;

    @include respond-to('small') {
        font-size: 16px;
    }
}

.games-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;

    @include respond-to('small') {
        grid-template-columns: 1fr;
        gap: 16px;
    }
}

.game-card {
    background-color: var(--mainBgColor);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s, box-shadow 0.3s;
    height: 100%;
    display: flex;
    flex-direction: column;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
}

.game-image-container {
    height: 180px;
    overflow: hidden;

    @include respond-to('small') {
        height: 160px;
    }
}

.game-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.game-info {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.game-title {
    margin: 0 0 8px;
    font-size: 20px;
    color: var(--textMainColor);
    font-weight: 500;
}

.game-desc {
    margin: 0 0 16px;
    font-size: 14px;
    color: var(--textSecColor);
    flex: 1;
}

.game-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
}

.play-button {
    background-color: var(--textHoverColor);
    color: #fff;
    padding: 8px 16px;
    border-radius: 6px;
    text-decoration: none;
    font-size: 14px;
    transition: background-color 0.3s;

    &:hover {
        background-color: var(--textHoverColor);
    }
}

.game-tag {
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 20px;
    background-color: rgba(var(--textHoverColorRGB), 0.1);
    color: var(--textHoverColor);
}
</style>
