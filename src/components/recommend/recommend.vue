<template>
  <div class="recommend" ref="list">
    <Scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <slider>
            <div v-for="item of recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <Loading v-show="!discList.length"></Loading>
          <ul class="list-box" v-show="discList.length">
            <li class="item" v-for="item of discList" :key="item.dissid" @click="selcetItem(item)">
              <img class="itemImg" v-lazy="item.imgurl" alt="">
              <span class="itemDsc">{{item.dissname}}</span>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
import Loading from 'base/loading/loading.vue'
import Scroll from 'base/scroll/scroll.vue'
import Slider from 'base/slider/slider.vue'
import {getRecommend, getDiscList} from 'api/recommend.js'
import {ERR_OK} from 'api/config.js'
import { playListMixin } from 'common/js/mixin.js'
import {mapMutations} from 'vuex'
export default {
  mixins: [playListMixin],
  data () {
    return {
      recommends: [],
      discList: [],
      loading: true
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : '0px'
      this.$refs.list.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    /* 轮播数据获取 */
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    /* 歌单数据获取 */
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    /* 监听轮播图片是否加载 */
    loadImage() {
      if (!this.checkedLoaded) {
        this.$refs.scroll.refresh()
        this.checkedLoaded = true
      }
    },
    selcetItem(recommend) {
      this.$router.push({
        path: `/recommend/${recommend.dissid}`
      })
      this.setRecommend(recommend)
      sessionStorage.recommend = JSON.stringify(recommend)
    },
    ...mapMutations({
      setRecommend: 'SET_RECOMMEND'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        height:0
        padding-bottom:40%
        overflow: hidden
      .recommend-list
        display: flex
        box-sizing: border-box
        justify-content:center
        align-items:center
        flex-direction: column;
        .list-title
          height: 40px
          line-height: 40px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .list-box
          width:96%
          overflow:hidden
          display:flex
          box-sizing: border-box
          justify-content: space-between
          align-items:center
          flex-wrap: wrap
          .item
            width: 32%
            overflow:hidden
            margin-bottom:20px
            .itemImg
              width:100%
              min-width:100%
              border-radius:5px
            .itemDsc
              font-size:$font-size-small
              display: -webkit-box
              -webkit-box-orient: vertical
              -webkit-line-clamp: 2
              overflow: hidden
              line-height:1.5
              margin-top:10px
              min-height:36px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
