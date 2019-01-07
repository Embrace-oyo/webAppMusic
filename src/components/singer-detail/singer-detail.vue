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
import {getSingerDetail} from 'api/singer.js'
import {createSong, isValidMusic, processSongsUrl} from 'common/js/song.js'
import musicList from 'components/singer-detail/music-list/music-list.vue'
export default {
  name: 'singer-detail',
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
      return this.singer.name ? this.singer.name : JSON.parse(sessionStorage.singer).name
    },
    bgImg() {
      return this.singer.avatar ? this.singer.avatar : JSON.parse(sessionStorage.singer).avatar
    },
    ...mapGetters([
      //  把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
      'singer'
    ])
  },
  methods: {
    /* 数据获取 */
    _getSingerDetail() {
      let id = this.singer.id ? this.singer.id : JSON.parse(sessionStorage.singer).id
      getSingerDetail(id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
            this.songs = songs
          })
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        // 等同于 let musicData = item.musicData
        let {musicData} = item
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  created () {
    this._getSingerDetail()
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
