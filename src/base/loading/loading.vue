<template>
  <div class="loading">
    <div class="loader loader-small"><div class="line-scale-pulse-out"><div></div><div></div><div></div><div></div><div></div></div></div>
    <span>{{this.title}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
import 'loaders.css'
export default {
  name: 'loading',
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .loading
    display:flex
    justify-content:center
    align-items:center
    text-align:center
    font-size:14px
    height:100%
    .loader
      transform: scale(0.5);
</style>
