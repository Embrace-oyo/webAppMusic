<template>
    <scroll ref="scroll" class="suggest" :data="result" :pullUp="pullUp" :beforeScroll="beforeScroll" @scrollToEnd="searchMore" @beforeScroll="beforeScrollFuc">
      <ul class="suggest-list">
        <li class="suggest-item" v-for="(item, index) of result" :key="index" @click="selectItem(item)">
          <div class="icon">
            <i :class="_getIconCls(item)"></i>
          </div>
          <div class="name">
            <p class="text" v-html="item.name || item.singername"></p>
          </div>
        </li>
        <Loading v-show="hasMore"></Loading>
      </ul>
      <div class="no-result-wrapper" v-show="!hasMore && !result.length">
        <no-result title="抱歉，暂无搜索结果"></no-result>
      </div>
    </scroll>
</template>

<script type="text/ecmascript-6">
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong, processSongsUrl, isValidMusic} from 'common/js/song.js'
import Scroll from 'base/scroll/scroll.vue'
import Loading from 'base/loading/loading.vue'
import noResult from 'base/no-result/no-result.vue'
import Singer from 'common/js/singer.js'
import {mapMutations, mapActions} from 'vuex'
const TYPE_SINGER = 'TYPE_SINGER'
const perpage = 20
export default {
  name: 'suggest',
  components: {Scroll, Loading, noResult},
  data() {
    return {
      page: 1,
      result: [],
      hasMore: true,
      pullUp: true,
      beforeScroll: true
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    refresh() {
      this.$refs.scroll.refresh()
    },
    search() {
      this.page = 1
      this.hasMore = true
      this.$refs.scroll.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((result) => {
            this.result = result
          })
          this._checkMore(res.data)
        }
      })
    },
    searchMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((result) => {
            this.result = this.result.concat(result)
          })
          this._checkMore(res.data)
        }
      })
    },
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curNum + song.curpage * this.pageSize) > song.totalnum) {
        this.hasMore = false
      }
    },
    _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid && this.page === 1) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
        ret = ret.concat(songs)
        return ret
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    _getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select', item)
    },
    beforeScrollFuc() {
      this.$emit('listScroll')
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query() {
      this.search()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 20px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: rgba(255, 255, 255, 0.7)
      .name
        flex: 1
        font-size: $font-size-medium
        color: rgba(255, 255, 255, 0.7)
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 30%
      transform: translateY(-50%)
</style>
