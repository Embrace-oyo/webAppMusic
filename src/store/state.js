/* 数据 */

import {playMode} from 'common/js/config.js'
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

const state = {
  // 歌手
  singer: {},
  // 播放状态
  playing: false,
  // 是否全屏
  fullScreen: false,
  // 播放列表
  playList: [],
  // 顺序列表
  sequenceList: [],
  // 播放模式
  mode: playMode.sequence,
  // 当前播放的索引
  currentIndex: -1,
  // 歌单推荐
  recommend: {},
  // 排行榜
  topList: {},
  // 搜索历史
  searchHistory: loadSearch(),
  // 播放器曾经播放过的歌曲列表
  playHistory: loadPlay(),
  // 喜欢的歌曲
  favoriteList: loadFavorite()
}

export default state
