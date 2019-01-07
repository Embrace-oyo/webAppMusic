<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots" :key="index"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScorll from 'better-scroll'
import {addClass} from 'common/js/dom'
export default {
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 2000
    }
  },
  methods: {
    /* 设置slider宽度 */
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    /* 初始化dots */
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    /* 初始化轮播 */
    _initSlider() {
      this.slider = new BScorll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        this.currentPageIndex = pageIndex
        if (this.autoplay) {
          clearTimeout(this.timer)
          this._autoPlay()
        }
      })
    },
    /* 轮播自动播放 */
    _autoPlay() {
      this.timer = setTimeout(() => {
        let pageIndex = this.currentPageIndex + 1
        if (pageIndex === this.dots.length) {
          pageIndex = 0
        }
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  },
  mounted () {
    /* 因为一般dom加载为17ms 所以用一个延时器来保证dom成功加载 */
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      this._autoPlay()
    }, 20)
    /* 监听窗口改变事件 */
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        transition: width 0.1s cubic-bezier(0.4, 0, 1, 1)
        &.active
          width: 20px
          border-radius: 5px
          background: #64e0bc
          transition: width 0.1s cubic-bezier(0.4, 0, 1, 1)
</style>
