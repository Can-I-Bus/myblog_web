export default {
    // 获取demo列表
    getArticle: {
        method: 'get',
        url: '/api/article',
    },
    //增加浏览量
    addScanNumber: {
        method: 'post',
        url: '/api/article/view',
    },
};
