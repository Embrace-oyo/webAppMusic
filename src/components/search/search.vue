<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="query"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!queryString" ref="wrapper">
      <scroll class="shortcut" :data="shortCut" ref="scroll">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item border" v-for="(item, index) of hotList" :key="index">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="queryString" ref="result">
      <suggest ref="suggest" :query="queryString" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" text="是否删除所有搜索历史" @confirm="deleteAllSearch"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import searchBox from 'base/search-box/search-box.vue'
import suggest from 'components/suggest/suggest.vue'
import searchList from 'base/search-list/search-list.vue'
import confirm from 'base/confirm/confirm.vue'
import scroll from 'base/scroll/scroll.vue'
import {playListMixin} from 'common/js/mixin.js'
import {getHotKey} from 'api/search.js'
import {ERR_OK} from 'api/config'
import {mapActions, mapGetters} from 'vuex'

export default {
  mixins: [playListMixin],
  name: 'search',
  data() {
    return {
      hotList: [],
      queryString: ''
    }
  },
  computed: {
    shortCut() {
      return this.hotList.concat(this.searchHistory)
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  components: {
    searchBox,
    suggest,
    searchList,
    confirm,
    scroll
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : '0px'
      this.$refs.wrapper.style.bottom = bottom
      this.$refs.result.style.bottom = bottom
      this.$refs.scroll.refresh()
      this.$refs.suggest.refresh()
    },
    query(query) {
      this.queryString = query
    },
    addQuery(itemK) {
      this.$refs.searchBox.setQuery(itemK)
    },
    _getHotKey() {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotList = res.data.hotkey.slice(0, 10)
        }
      })
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    saveSearch() {
      this.saveSearchHistory(this.queryString)
    },
    deleteSearchHistory(query) {
      this.deleteSearchHistory(query)
    },
    deleteAllSearch() {
      this.deleteSearchHistoryAll()
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'deleteSearchHistoryAll'
    ])
  },
  watch: {
    queryString(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      }
    }
  },
  created() {
    this._getHotKey()
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .search
    .search-box-wrapper
      margin:24px 20px 10px 20px
    .shortcut-wrapper
      position: fixed
      top: 170px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 10px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 10px 10px 0
            border-radius: 50px
            font-size: $font-size-medium
            color: #fff
            &:before
              border-radius: 50px
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
