<template>
    <div class="singer" ref="list">
      <Listview @select="selectSinger" :data="singerList" v-show="singerList.length !== 0" ref="listview"></Listview>
      <Loading v-show="singerList.length === 0"></Loading>
      <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
import Listview from 'base/listview/listview.vue'
import {getSingerList} from 'api/singer.js'
import {ERR_OK} from 'api/config.js'
import Singer from 'common/js/singer.js'
import Loading from 'base/loading/loading.vue'
import { mapMutations } from 'vuex'
import { playListMixin } from 'common/js/mixin.js'

const HOT_NAME = '热门'
const HOT_SIGN_LEN = 10

export default {
  name: 'singer',
  mixins: [playListMixin],
  components: {
    Listview,
    Loading
  },
  data() {
    return {
      singerList: []
    }
  },
  methods: {
    /* 获取接口数据 */
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singerList = this._normalizeSinger(res.data.list)
        }
      })
    },
    /* 数据重组 */
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        /* 将list数据前10条放入map.hot.items中 */
        if (index < HOT_SIGN_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        /* 取对象名 */
        const key = item.Findex
        /* 如果没有这个 对象名 的对象 则赋值一个对象 给这个对象 */
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        /* 如果这个对象名 有对象 则这个对象名下的items传入一个对象 */
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      /* 为了得到有序列表还需要处理map */
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      /* 字母排序 */
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    /* vuex自带的映射方法 在组件中提交 Mutation */
    ...mapMutations({
      // 将 `this.add()` 映射为 `this.$store.commit('increment')`
      setSinger: 'SET_SINGER'
    }),
    /* 监听下层组件传过来事件 需要执行的方法 */
    selectSinger (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      /* 向vuex的 mutations 发送需要执行那个函数的命令 */
      this.setSinger(singer)
      sessionStorage.singer = JSON.stringify(singer)
    },
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : '0px'
      this.$refs.list.style.bottom = bottom
      this.$refs.listview.refresh()
    }
  },
  created() {
    this._getSingerList()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position:fixed
    top:88px
    bottom:0
    width: 100%

</style>
