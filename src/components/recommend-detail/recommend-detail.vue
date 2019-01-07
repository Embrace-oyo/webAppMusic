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
import {getSongList} from 'api/recommend.js'
import {createSong, isValidMusic, processSongsUrl} from 'common/js/song.js'
import musicList from 'components/recommend-detail/music-list/music-list.vue'
export default {
  name: 'recommend-detail',
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
      return this.recommend.dissname ? this.recommend.name : JSON.parse(sessionStorage.recommend).dissname
    },
    bgImg() {
      return this.recommend.imgurl ? this.recommend.imgurl : JSON.parse(sessionStorage.recommend).imgurl
    },
    ...mapGetters([
      'recommend'
    ])
  },
  methods: {
    /* 数据获取 */
    _getRcommendDetail() {
      let id = this.recommend.dissid ? this.recommend.dissid : JSON.parse(sessionStorage.recommend).dissid
      getSongList(id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((recommendList) => {
            this.songs = recommendList
          })
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        let flag = isValidMusic(item)
        if (flag) {
          let arr = createSong(item)
          ret.push(arr)
        }
      })
      return ret
    }
  },
  created () {
    this._getRcommendDetail()
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
