<template>
  <transition name="slide">
    <div class="singer-detail">
      <music-list :songs="songs" :title="title" :bgImg="bgImg"></music-list>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import {ERR_OK} from 'api/config.js'
import {getMusicList} from 'api/rank.js'
import {createSong, isValidMusic, processSongsUrl} from 'common/js/song.js'
import musicList from 'components/rank/music-list.vue'
export default {
  name: 'rank-detail',
  data() {
    return {
      songs: []
    }
  },
  components: {
    musicList
  },
  computed: {
    title() {
      return this.topList.topTitle ? this.topList.topTitle : JSON.parse(sessionStorage.topList).topTitle
    },
    bgImg() {
      return this.topList.picUrl ? this.topList.picUrl : JSON.parse(sessionStorage.topList).picUrl
    },
    ...mapGetters([
      'topList'
    ])
  },
  methods: {
    /* 数据获取 */
    _getRankDetail() {
      let id = this.topList.id ? this.topList.id : JSON.parse(sessionStorage.topList).id
      getMusicList(id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.songlist)).then((songs) => {
            this.songs = songs
          })
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  created () {
    this._getRankDetail()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  .slide-enter-active, .slide-leave-active
    transition: all 0.5s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
  .singer-detail
    position: fixed
    z-index:100
    top:0
    left:0
    bottom:0
    right:0
    &:before
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
      filter: blur(2px);
</style>
