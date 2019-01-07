/* 数据获取 一般用getter 来取数据到组件中而不是state */

/* import state from './state.js' */

// es6 箭头函数的简写 一个function return
export const singer = (state) => { return state.singer }

export const playing = (state) => { return state.playing }
export const fullScreen = (state) => { return state.fullScreen }
export const playList = (state) => { return state.playList }
export const sequenceList = (state) => { return state.sequenceList }
export const mode = (state) => { return state.mode }
export const currentIndex = (state) => { return state.currentIndex }
export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}
export const recommend = (state) => { return state.recommend }
export const topList = (state) => { return state.topList }

export const playHistory = (state) => { return state.playHistory }
export const searchHistory = (state) => { return state.searchHistory }
export const favoriteList = (state) => { return state.favoriteList }
