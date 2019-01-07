/* 同步  改变数据的方法 */

// 按 es6 的规范 import * as obj from "xxx" 会将 "xxx" 中所有 export 导出的内容组合成一个对象返回。
import * as types from './mutation-types.js'

// [types.SET_SINGER] 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名 */

const mutations = {
  // 歌手列表页跳转歌手详情页 数据的改变
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  // 播放器播放状态
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  // 播放器全屏
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  // 播放列表数据传递 (普通列表)
  [types.SET_PLAYLIST](state, list) {
    state.playList = list
  },
  // 播放列表数据传递 (顺序列表)
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  // 列表播放模式
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  // 当前播放的索引
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  // 歌单推荐
  [types.SET_RECOMMEND](state, recommend) {
    state.recommend = recommend
  },
  // 排行榜
  [types.SET_TOPLIST](state, topList) {
    state.topList = topList
  },
  // 播放历史
  [types.SET_PLAY_HISTORY](state, history) {
    state.playHistory = history
  },
  // 搜索历史
  [types.SET_SEARCHHISTORY](state, searchHistory) {
    state.searchHistory = searchHistory
  },
  // 喜欢的歌曲
  [types.SET_FAVORITELIST](state, favoriteList) {
    state.favoriteList = favoriteList
  }
}

export default mutations
