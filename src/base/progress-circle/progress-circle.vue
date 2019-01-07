<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashoffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'progress-circle',
  props: ['radius', 'percent'],
  data() {
    return {
      dashArray: Math.PI * 100
    }
  },
  computed: {
    dashoffset() {
      return -(this.percent / 100 * this.dashArray)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .progress-circle
    position: relative
    z-index: 999
    svg
      position:relative
      z-index: 9999
      circle
        stroke-width: 10px
        transform-origin: center
        &.progress-background
          transform: scale(0.9)
        &.progress-bar
          transform: scale(0.9) rotate(270deg)
          stroke: #2F9A90
</style>
