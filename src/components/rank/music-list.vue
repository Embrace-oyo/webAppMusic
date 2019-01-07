<template>
  <div class="music-list">
    <div class="back" @click="back" ref="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgImg">
      <div class="play-wrapper" ref="playWrapper" v-show="songs.length">
        <div class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <Scroll @scroll="scroll" :data="songs" :probe-type="probeType" :listen-scroll="listenScroll"  class="list" ref="list">
      <singer-song-list :songs="songs" class="wrapper" ref="wrapper" @select="selectItem"></singer-song-list>
    </Scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import singerSongList from 'components/rank/rank-song-list.vue'
import Scroll from 'base/scroll/scroll.vue'
import {mapActions} from 'vuex'
import {playListMixin} from 'common/js/mixin.js'

export default {
  name: 'music-list',
  mixins: [playListMixin],
  data() {
    return {
      scrollY: 0,
      initHeight: 0
    }
  },
  props: ['songs', 'title', 'bgImg'],
  components: {
    Scroll,
    singerSongList
  },
  computed: {
    bgStyle() {
      return `background:url(${this.bgImg}) no-repeat center;background-size: cover;`
    }
  },
  methods: {
    // 返回上一层
    back() {
      this.$router.back()
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    // 选中歌曲播放
    selectItem(item, index) {
      this.selectPlay({
        list: item,
        index: index
      })
    },
    // 随机播放
    random() {
      this.randomPlay({
        list: this.songs
      })
    },
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : '0px'
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    // 实例化仓库中的方法
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  mounted () {
    this.initHeight = this.$refs.bgImg.offsetHeight
    this.$refs.list.$el.style.top = `${this.$refs.bgImg.offsetHeight}px`
    this.imageHeight = this.$refs.bgImg.clientHeight - this.$refs.back.clientHeight
    this.minTranslateY = -this.imageHeight
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  },
  watch: {
    scrollY (newY) {
      let y = (newY > 0) ? 0 : newY
      let translateY = Math.max(this.minTranslateY, y)
      this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`
      this.$refs.layer.style['-webkit-transform'] = `translate3d(0,${translateY},0)`
      this.$refs.bgImg.style.paddingTop = translateY + this.initHeight + 'px'
      const percnet = Math.abs(newY / this.imageHeight)
      let scale = 1 + percnet
      let blur = Math.min(20 * percnet, 20)
      if (newY > 0) { // 向下拉动
        if ((newY + this.initHeight) > this.initHeight) { // 限制最大高度
          this.$refs.bgImg.style.paddingTop = this.initHeight
        }
        this.$refs.bgImg.style.transform = `scale(${scale})`
        this.$refs.bgImg.style.filter = `blur(${blur}px)`
      } else { // 向上拉动
        this.$refs.bgImg.style.transform = `scale(1)`
      }
      if ((translateY + this.initHeight) > (this.$refs.back.clientHeight + this.$refs.playWrapper.clientHeight)) {
        this.$refs.playWrapper.style.opacity = 1
      } else {
        this.$refs.playWrapper.style.opacity = 0
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      z-index:10
      .play-wrapper
        position: absolute
        bottom: 10px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
/*      &:before
        content: ''
        width:100%
        height:0
        padding-bottom:100vh
        overflow: hidden
        bg-image('~common/stylus/images/bg.jpg')
        background-size:112%
        position: absolute
        top:0
        left:0
        bottom:0
        right:0
        filter: blur(2px);*/
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      .song-list-wrapper
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
