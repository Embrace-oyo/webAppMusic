<template>
  <div class="progress-bar" ref="progressBar" @click.prevent="progressSan">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend.prevent="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'progress-bar',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.init) {
        const barWidth = this.$refs.progressBar.clientWidth
        const fix = 8 / barWidth * 100
        this.$refs.progress.style.width = Math.floor(newPercent) + '%'
        this.$refs.progressBtn.style.left = Math.floor(newPercent) - fix + '%'
      }
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    // 进度条拖动开始
    progressTouchStart(e) {
      this.touch.init = true
      this.touch.pageX = e.touches[0].pageX
    },
    // 进度条拖动中
    progressTouchMove(e) {
      if (this.touch.init) {
        this.touch = this.commonObj(e.touches[0].pageX)
        this.$emit('moveProgress', this.touch)
      }
    },
    // 进度条拖动结束
    progressTouchEnd(e) {
      this.touch.init = false
      this.$emit('endProgress', this.touch)
      this.touch = {}
    },
    // 进度条点击
    progressSan(e) {
      this.touch = this.commonObj(e.x)
      this.$emit('clickProgress', this.touch)
      this.touch = {}
    },
    // 公用对象计算
    commonObj(x) {
      let fix = this.$refs.progressBtn.clientWidth / 2
      let max = this.$refs.progressBar.clientWidth
      let progressBarLeft = this.$refs.progressBar.offsetLeft
      let offsetX = -(window.screen.width - progressBarLeft - x - max)
      if (offsetX < 0) { offsetX = 0 } else if (offsetX > max) { offsetX = max }
      this.$refs.progress.style.width = offsetX + 'px'
      this.$refs.progressBtn.style.left = offsetX - fix + 'px'
      this.touch.percent = offsetX / max
      return this.touch
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(255, 255, 255, 0.3)
      border-radius: 5px
      .progress
        position: absolute
        height: 100%
        background: #64e0bc
        border-radius: 5px
        width:0
      .progress-btn-wrapper
        position: absolute
        left: -7px
        top: -6px
        width: 16px
        height: 16px
        background:#fff
        border-radius:50%
        .progress-btn
          position: relative
          top: 6px
          left: 6px
          box-sizing: border-box
          width: 4px
          height: 4px
          border-radius: 50%
          background: #64e0bc
</style>
