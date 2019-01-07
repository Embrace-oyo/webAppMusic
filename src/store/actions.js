/* 异步  改变数据的方法  如果在一个动作总多次改变mutation 那么我们需要封装一个action */

import * as types from './mutation-types.js'
import {playMode} from 'common/js/config.js'
import {shuffle} from 'common/js/until.js'
import {saveSearch, savePlay, deletSearch, clearSearch, saveFavorite, deleteFavorite} from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

// 点击播放数据处理
export const selectPlay = ({commit, state}, {list, index}) => {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 随机播放数据处理
export const randomPlay = ({commit}, {list}) => {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 点击歌曲插入到播放列表
export const insertSong = function ({commit, state}, song) {
  let playlist = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 保存搜索历史
export const saveSearchHistory = function ({commit, state}, query) {
  commit(types.SET_SEARCHHISTORY, saveSearch(query))
}

// 删除搜索历史
export const deleteSearchHistory = function ({commit, state}, query) {
  commit(types.SET_SEARCHHISTORY, deletSearch(query))
}

// 删除所有搜索历史
export const deleteSearchHistoryAll = function ({commit}) {
  commit(types.SET_SEARCHHISTORY, clearSearch())
}

// 删除播放列表其中一首歌曲
export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = playlist.findIndex((item) => {
    return song.id === item.id
  })
  let sIndex = sequenceList.findIndex((item) => {
    return item.id === song.id
  })
  playlist.splice(pIndex, 1)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

// 清除播放列表
export const deleteSongList = function ({commit}) {
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYLIST, [])
}

// 保存歌曲到播放记录
export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

// 点击红心收藏的
export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITELIST, saveFavorite(song))
}
// 取消红心收藏的
export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITELIST, deleteFavorite(song))
}
