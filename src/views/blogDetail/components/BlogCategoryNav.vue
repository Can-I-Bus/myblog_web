<template>
    <div class="blog_category_nav_wrap">
        <Tree :tree-data="categoryTree" recKey="children" childrenKey="article_list" titleKey="name" v-model="activeNames" />
    </div>
</template>
<script setup name="CategoryNav">
import { ref, getCurrentInstance, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { deepClone } from '@/utils';
import Tree from '@/components/tree/index.vue';
const { $api } = getCurrentInstance().proxy;
const activeNames = ref([]);
const categoryTree = ref([]);

const getBlogCategoryList = async () => {
    const data = { need_article: true };
    const addKey = (arr) => {
        const _arr = deepClone(arr);
        for (let i = 0; i < _arr.length; i++) {
            _arr[i].article_list = _arr[i].article_list.map((item) => {
                item.key = uuidv4();
                return item;
            });
            if (_arr[i].children && _arr[i].children.length > 0) {
                addKey(_arr[i].children);
            }
        }
        return _arr;
    };
    const res = await $api({ type: 'getBlogCategoryList', data });
    if (res.code === 0) {
        categoryTree.value = addKey(res.data);
        if (categoryTree.value[0].article_list[0]) {
            activeNames.value.push(categoryTree.value[0].article_list[0].key);
        }
    }
};

onMounted(() => {
    getBlogCategoryList();
});
</script>
<style scoped lang="scss">
@use '@/css/media.scss' as *;
@use '@/css/mixin.scss' as *;
.blog_category_nav_wrap {
    height: calc(100vh - 100px);
    position: sticky;
    top: 0;
}
</style>
