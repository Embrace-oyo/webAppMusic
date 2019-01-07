<template>
  <div id="app">
    <div class="boxShadow">
      <m-header></m-header>
      <tab></tab>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
// 引用m-header.vue文件
import MHeader from 'components/m-header/m-header.vue'
// 引用tab.uve文件
import Tab from 'components/tab/tab.vue'
// 引用player.vue
import player from 'components/player/player.vue'

export default {
  components: { // 注册组件
    MHeader,
    Tab,
    player
  }
}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  #app
    position:relative
    .boxShadow
      box-shadow: 0px 0px 20px 1px rgba(0, 0, 0, 0.3)
</style>
