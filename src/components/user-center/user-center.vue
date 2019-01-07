<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switch-wrapper">
        <swithces :switches="switches" :currentIndex="currentIndex" @switch="switchIndex"></swithces>
      </div>
      <div ref="playBtn" class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机全部播放</span>
      </div>
      <div class="list-wrapper" ref="listwrapper">
        <scroll ref="favoriteList" v-if="currentIndex === 0" class="list-scroll" :data="favoriteList">
          <div class="list-inner">
            <song-list :rank="rank" :numShow="numShow" :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll ref="searchList" class="list-scroll" v-if="currentIndex === 1" :data="playHistory">
          <div class="list-inner">
            <song-list :rank="rank" :numShow="numShow" :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import swithces from 'base/switches/switches'
import scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list.vue'
import {mapGetters, mapActions} from 'vuex'
import Song from 'common/js/song.js'
import {playListMixin} from 'common/js/mixin'
import NoResult from 'base/no-result/no-result'

export default {
  mixins: [playListMixin],
  name: 'user-center',
  components: {
    NoResult,
    swithces,
    scroll,
    SongList
  },
  computed: {
    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length
      } else {
        return !this.playHistory.length
      }
    },
    noResultDesc() {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲'
      } else {
        return '暂无最近播放记录'
      }
    },
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ])
  },
  data() {
    return {
      switches: [
        {name: '我喜欢的'},
        {name: '最近听的'}
      ],
      currentIndex: 0,
      numShow: true,
      rank: true
    }
  },
  methods: {
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.listwrapper.style.bottom = bottom
      this.$refs.favoriteList && this.$refs.favoriteList.refresh()
      this.$refs.playList && this.$refs.playList.refresh()
    },
    back() {
      this.$router.go(-1)
    },
    switchIndex(index) {
      this.currentIndex = index
    },
    selectSong(item) {
      this.insertSong(new Song(item))
    },
    random() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      list = list.map((song) => {
        return new Song(song)
      })
      this.randomPlay({list})
    },
    ...mapActions([
      'insertSong',
      'randomPlay'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    &:before
      content: ''
      position:absolute
      left:0
      top:0
      right:0
      bottom:0
      z-index: -1
      bg-image('~common/stylus/images/bg.jpg')
      background-size: cover
      filter:blur(3px)
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
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
    .switch-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
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
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
