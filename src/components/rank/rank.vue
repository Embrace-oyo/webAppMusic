<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" ref="toplist">
      <ul v-show="topList.length">
        <li class="item border-bottom" v-for="items of topList" :key="items.id" @click="router(items)">
          <div class="icon">
            <img width="100" height="100" v-lazy="items.picUrl"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(item, index) of items.songList" :key="index">
              <span>{{index + 1}}.</span>
              <span>{{item.songname}} - {{item.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import scroll from 'base/scroll/scroll.vue'
import loading from 'base/loading/loading.vue'
import {ERR_OK} from 'api/config'
import {getTopList} from 'api/rank.js'
import {playListMixin} from 'common/js/mixin.js'
import {mapMutations} from 'vuex'
export default {
  mixins: [playListMixin],
  name: 'rank',
  data() {
    return {
      topList: []
    }
  },
  components: {
    scroll,
    loading
  },
  methods: {
    _getTopList() {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : '0px'
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    router(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item)
      sessionStorage.topList = JSON.stringify(item)
    },
    ...mapMutations({
      setTopList: 'SET_TOPLIST'
    })
  },
  created() {
    this._getTopList()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        padding: 5px 0
        height: 100px
        &:before
          border-color: rgba(255, 255, 255, 0.5)
        &:last-child
          padding-bottom: 10px
          &:before
            border:none
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
          border-radius:5px
          overflow: hidden
          margin-left:10px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          color: #fff
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
