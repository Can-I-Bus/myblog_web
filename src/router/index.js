import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/home',
            name: 'home',
            component: () => import('../views/home/index.vue'),
        },
        {
            path: '/',
            name: 'layout',
            component: () => import('../views/layout/index.vue'),
            redirect: '/home',
            children: [
                //博客详情
                {
                    path: '/blog/:id',
                    name: 'blogDetail',
                    component: () => import('../views/blogDetail/index.vue'),
                },
                //博客列表
                {
                    path: '/blog',
                    name: 'blog',
                    component: () => import('../views/blogList/index.vue'),
                },
                //demo列表
                {
                    path: '/demo',
                    name: 'demo',
                    component: () => import('../views/demo/index.vue'),
                },
                //留言墙
                {
                    path: '/message',
                    name: 'message',
                    component: () => import('../views/message/index.vue'),
                },
                //关于我
                {
                    path: '/about',
                    name: 'about',
                    component: () => import('../views/about/index.vue'),
                },
                //游戏列表
                {
                    path: '/games',
                    name: 'games',
                    component: () => import('../views/games/index.vue'),
                },
                //井字棋游戏
                {
                    path: '/tictactoe',
                    name: 'tictactoe',
                    component: () => import('../views/tictactoe/index.vue'),
                },
            ],
        },
    ],
});

export default router;
