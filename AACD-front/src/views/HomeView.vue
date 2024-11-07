<script>
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import router from "@/router/index.js";

export default defineComponent({
  setup() {
    return {
      RouterView
    };
  },
  mounted() {
    // 获取当前路由的一级目录
    // this.navigationValue
    document.getElementById('nav').value = this.$route.path.split('/')[1]
  },
  data() {
    return {
      navigationValue: '',
    }
  },
  methods: {
    routerTo(path) {
      router.push(path)
    }
  }
});
</script>

<template>
  <mdui-navigation-rail id="nav">
    <mdui-button-icon icon="menu" slot="top"></mdui-button-icon>
    <mdui-fab lowered icon="edit--outlined" slot="top">提交</mdui-fab>
    <mdui-button-icon icon="settings" slot="bottom"></mdui-button-icon>

    <mdui-navigation-rail-item icon="topic" value="conference-list" @click="routerTo('/conference-list')">会议</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="newspaper" value="news-list" @click="routerTo('/news-list')">新闻</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="search" value="search" @click="routerTo('/search')">搜索</mdui-navigation-rail-item>
  </mdui-navigation-rail>
  <RouterView />
</template>

<style scoped>
</style>