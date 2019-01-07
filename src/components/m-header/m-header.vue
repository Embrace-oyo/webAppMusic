<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Embrace Music</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /*样式规范定义加载 ~是stylus的一个方法*/
  @import "~common/stylus/variable"
  /* 样式变量加载 */
  @import "~common/stylus/mixin"
  /* 当前组件样式 */
  .m-header
    position: relative
    height: 44px
    text-align: center
    color: $color-theme
    font-size: 0
    .icon
      display: inline-block
      vertical-align: top
      margin-top: 6px
      width: 30px
      height: 30px
      margin-right: 9px
      logo-image('logo')  //引用函数变量
      background-size:cover
      border-radius:50%
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size:14px
      font-weight: bold
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
</style>
