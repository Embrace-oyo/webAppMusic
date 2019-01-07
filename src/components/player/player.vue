<template>
    <div class="player" v-show="playList.length>0">
      <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
        <div class="normal-player" v-show="fullScreen">
          <div class="background">
            <img width="100%" height="100%" :src="currentSong.image" alt="">
          </div>
          <div class="top">
            <div class="back" @click="close">
              <i class="icon-back"></i>
            </div>
            <h1 class="title" v-html="currentSong.name"></h1>
            <h2 class="subtitle" v-html="currentSong.singer"></h2>
          </div>
          <div class="middle" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
            <div class="middle-l" ref="middle">
              <div class="cd-wrapper" ref="cdWrapper">
                <div class="cd">
                  <img :src="currentSong.image" alt="" class="image" :class="cdClass">
                </div>
              </div>
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric" v-html="playingLyric"></div>
              </div>
            </div>
            <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
              <div class="lyric-wrapper">
                <div v-if="currentLyric">
                  <p ref="lyricLine" :key="index" class="text" :class="{'current':currentLineNum === index}" v-for="(line, index) of currentLyric.lines" v-html="line.txt"></p>
                </div>
              </div>
            </scroll>
          </div>
          <div class="bottom">
            <div class="dot-wrapper">
              <span class="dot" :class="{'active':currentShow==='cd'}"></span>
              <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
            </div>
            <div class="progress-wrapper">
              <span class="time time-l">{{timeFormat(currentTime)}}</span>
              <div class="progress-bar-wrapper">
                <progress-bar @clickProgress="clickProgress" @moveProgress="moveProgress" @endProgress="endProgress" :percent="percent"></progress-bar>
              </div>
              <span class="time time-r">{{timeFormat(currentSong.duration)}}</span>
            </div>
            <div class="operators">
              <div class="icon i-left">
                <i :class="iconMode" @click="changeMode"></i>
              </div>
              <div class="icon i-left" :class="disable">
                <i @click="prev" class="icon-prev"></i>
              </div>
              <div class="icon i-center" :class="disable">
                <i @click="togglePlaying" :class="playingIcon"></i>
              </div>
              <div class="icon i-right" :class="disable">
                <i @click="next" class="icon-next"></i>
              </div>
              <div class="icon i-rigth">
                <i class="icon" @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <transition name="mini">
        <div class="mini-player"  @click="open" v-show="!fullScreen">
          <div class="icon">
            <img  width="40" height="40" :src="currentSong.image" alt="" class="borderRadius imgWrapper" :class="cdClass">
          </div>
          <div class="text">
            <h2 class="name" v-html="currentSong.name"></h2>
            <p class="desc" v-html="currentSong.singer"></p>
          </div>
          <div class="control" @click.stop="togglePlaying">
            <progress-circle radius="32" :percent="percent">
              <i class="icon-mini" :class="miniIcon"></i>
            </progress-circle>
          </div>
          <div class="control" @click.stop="showPlayList">
            <i class="icon-playlist"></i>
          </div>
        </div>
      </transition>
      <play-list ref="playlist"></play-list>
      <audio ref="audio" :src="currentSong.url" @playing="ready" @error="error" @timeupdate="upDataTime" @ended="end" @paused="paused"></audio>
    </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations, mapActions } from 'vuex'
import animations from 'create-keyframe-animation'
import progressBar from 'base/progress-bar/progress-bar.vue'
import progressCircle from 'base/progress-circle/progress-circle.vue'
import playList from 'components/playlist/playlist.vue'
import Lyric from 'lyric-parser'
import { shuffle } from 'common/js/until.js'
import scroll from 'base/scroll/scroll'
import {playMode} from 'common/js/config'
import {playerMixin} from 'common/js/mixin'

const timeExp = /\[(\d{2}):(\d{2}):(\d{2})]/g

export default {
  mixins: [playerMixin],
  name: 'player',
  data() {
    return {
      songReady: false,
      currentTime: 0,
      moveProgressBlean: false,
      currentLyric: null,
      currentLineNum: 0,
      playingLyric: '',
      currentShow: 'cd',
      touch: {}
    }
  },
  components: {
    progressBar,
    progressCircle,
    scroll,
    playList
  },
  computed: {
    // 播放按钮图标改变
    playingIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    // mini播放器按钮图标改变
    miniIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    // cd旋转class
    cdClass() {
      return this.playing ? 'play' : 'play pause'
    },
    // 不能点击的样式
    disable() {
      return this.songReady ? '' : 'disable'
    },
    // 歌曲总时长
    duration() {
      let s = this.currentSong.duration % 60
      let m = Math.floor(this.currentSong.duration / 60)
      s = s < 10 ? '0' + s : s
      m = m < 10 ? '0' + m : m
      let duration = m + ':' + s
      return duration
    },
    // 进度条百分比计算
    percent() {
      return this.currentTime / this.currentSong.duration * 100
    },
    // 获取仓库中的数据
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList',
      'favoriteList'
    ])
  },
  methods: {
    // 播放器最小化
    close() {
      this.setFullScreen(false)
    },
    // 播放器最大化
    open() {
      this.setFullScreen(true)
    },
    // cd的动画（显示动画）
    enter(el, done) {
      const {x, y, scale} = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 500,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    // cd的动画 （显示动画结束）
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
      this.$refs.cdWrapper.style.transform = ''
    },
    // cd的动画 （离开动画）
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style['transform'] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      const timer = setTimeout(done, 400)
      this.$refs.cdWrapper.addEventListener('transitionend', () => {
        clearTimeout(timer)
        done()
      })
    },
    // cd的动画（离开动画结束）
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style['transform'] = ''
    },
    // cd的动画 （计算动画坐标）
    _getPosAndScale() {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {x, y, scale}
    },
    // 暂停播放事件
    togglePlaying() {
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    // 监听播放器暂停
    paused() {
      this.setPlayingState(false)
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
    },
    // loop
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlayingState(true)
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    // 下一曲
    next() {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
    },
    // 上一曲
    prev() {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
    },
    // 歌曲加载完成
    ready() {
      clearTimeout(this.timer)
      this.songReady = true
      this.canLyricPlay = true
      this.savePlayHistory(this.currentSong)
      // 如果歌曲的播放晚于歌词的出现，播放的时候需要同步歌词
      if (this.currentLyric && !this.isPureMusic) {
        this.currentLyric.seek(this.currentTime * 1000)
      }
    },
    // 歌曲加载错误
    error() {
      console.log('加载失败')
      this.songReady = true
      setTimeout(() => {
        this.next()
      }, 1000)
    },
    // 歌曲时间获取
    upDataTime(e) {
      if (this.moveProgressBlean === false) {
        this.currentTime = e.target.currentTime
      }
    },
    // 歌曲时间格式化
    timeFormat(time) {
      // 等同于Math.floor(向下取整)
      time = time | 0
      const m = this._pad(time / 60 | 0)
      const s = this._pad(time % 60)
      return `${m}:${s}`
    },
    // 补零
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    // 进度条拖动事件
    moveProgress(obj) {
      let newTime = obj.percent * this.currentSong.duration
      this.currentTime = Math.floor(newTime)
      this.moveProgressBlean = obj.init
    },
    // 进度条拖动完毕
    endProgress(obj) {
      this.moveProgressBlean = obj.init
      if (!this.playing) {
        this.togglePlaying()
      }
      this.$refs.audio.currentTime = obj.percent * this.currentSong.duration
      if (this.currentLyric) {
        this.currentLyric.seek(this.$refs.audio.currentTime * 1000)
      }
    },
    // 进度条点击事件
    clickProgress(obj) {
      if (!this.playing) {
        this.togglePlaying()
      }
      this.$refs.audio.currentTime = obj.percent * this.currentSong.duration
      if (this.currentLyric) {
        this.currentLyric.seek(this.$refs.audio.currentTime * 1000)
      }
    },
    // 改变播放模式
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = []
      if (mode === playMode.random) {
        // 随机播放
        list = shuffle(this.sequenceList)
      } else {
        // 单曲循环和列表顺序循环
        list = this.sequenceList
      }
      // 设置播放索引
      let index = null
      list.forEach((item, inx) => {
        if (item.id === this.currentSong.id) {
          index = inx
        }
      })
      // 重置播放列表
      this.setPlayList(list)
      // 重置播放索引
      this.setCurrentIndex(index)
    },
    // 当前歌曲播放结束根据模式来切歌
    end() {
      if (this.mode === playMode.sequence || this.mode === playMode.random) {
        this.next()
      } else {
        this.$refs.audio.play()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    // 歌词获取
    getLyric() {
      this.currentSong.getLyric().then((lyric) => {
        if (this.currentSong.lyric !== lyric) {
          return
        }
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        this.isPureMusic = !this.currentLyric.lines.length
        if (this.isPureMusic) {
          this.pureMusicLyric = this.currentLyric.lrc.replace(timeExp, '').trim()
          this.playingLyric = this.pureMusicLyric
        } else {
          if (this.playing && this.canLyricPlay) {
            // 这个时候有可能用户已经播放了歌曲，要切到对应位置
            this.currentLyric.seek(this.currentTime * 1000)
          }
        }
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    // 歌词高亮
    handleLyric({lineNum, txt}) {
      if (!this.$refs.lyricLine) {
        return
      }
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    // 歌词与cd滑动开始
    touchStart(e) {
      this.touch.initiated = true
      // 用来判断是否是一次移动
      this.touch.moved = false
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    // 歌词与cd滑动中
    touchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      if (!this.touch.moved) {
        this.touch.moved = true
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.middle.style.opacity = 1 - this.touch.percent
    },
    // 歌词与cd滑动结束
    touchEnd(e) {
      if (!this.touch.moved) {
        return
      }
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.middle.style.opacity = opacity
      this.touch.initiated = false
    },
    // 播放列表显示
    showPlayList() {
      this.$refs.playlist.show()
    },
    // 搜藏按钮点击
    toggleFavorite(currentSong) {
      if (this.isFavorite(currentSong)) {
        this.deleteFavoriteList(currentSong)
      } else {
        this.saveFavoriteList(currentSong)
      }
    },
    getFavoriteIcon(currentSong) {
      if (this.isFavorite(currentSong)) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    },
    isFavorite(currentSong) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === currentSong.id
      })
      return index > -1
    },
    // 改变仓库中的数据的方法
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    // 改变仓库中的数据的方法
    ...mapActions([
      'savePlayHistory',
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  },
  watch: {
    // 监听数据加载 然后播放
    currentSong(newSong, oldSong) {
      if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
        return
      }
      this.songReady = false
      this.canLyricPlay = false
      if (this.currentLyric) {
        this.currentLyric.stop()
        // 重置为null
        this.currentLyric = null
        this.currentTime = 0
        this.playingLyric = ''
        this.currentLineNum = 0
      }
      this.$refs.audio.src = newSong.url
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
      // 若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲。
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.songReady = true
      }, 5000)
      this.getLyric()
    },
    // 监听播放器是否暂停
    playing(newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        if (newPlaying) {
          audio.play()
        } else {
          audio.pause()
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          transition: all 0.5s
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            box-sizing: border-box
            height: 100%
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                box-sizing: border-box
                border-radius: 50%
                border: 10px solid rgba(255, 255, 255, 0.1)
              .play
                animation: rotate 60s linear infinite
              .pause
                animation-play-state: paused
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          transition: all 0.5s
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
            .pure-music
              padding-top: 50%
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
              transition: all 0.2s
        .progress-wrapper
          display: flex
          align-items: center
          justify-content: space-between
          width: 90%
          margin: 0px auto
          padding: 10px 0
          .time
            color: rgba(255,255,255,0.5)
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            width: 75%
        .operators
          display: flex
          align-items: center
          justify-content: space-around
          .icon
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      box-shadow: 0px 0px 30px 1px rgba(0, 0, 0, 0.5)
      &:before
        content: ''
        width:100%
        height:0
        padding-bottom:100vh
        overflow: hidden
        bg-image('~common/stylus/images/bg.jpg')
        background-position-y: -90vh
        background-size:112%
        position: absolute
        top:0
        left:0
        bottom:0
        right:0
        filter: blur(2px)
        z-index:-1
      .borderRadius
        border-radius:50%
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        height: 40px
        padding: 0 10px 0 20px
        .imgWrapper
          height: 100%
          width: 100%
        img
          border-radius: 50%
          &.play
            animation: rotate 60s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: #fff
        .icon-mini
          font-size: 30px
          position: absolute
          left: 1px
          top: 1px
          z-index: 0
          color:rgba(255,255,255,0.5)
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
  .disable
    color: $color-theme-d
</style>
