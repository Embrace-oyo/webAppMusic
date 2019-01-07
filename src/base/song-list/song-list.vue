<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, index)" class="item border-bottom" v-for="(song, index) in songs" :key="index">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    songs: {
      type: Array,
      default: () => {
        return []
      }
    },
    rank: {
      type: Boolean,
      default: false
    },
    numShow: {
      type: Boolean,
      default: false

    }
  },
  methods: {
    selectItem(item, index) {
      this.$emit('select', item, index)
    },
    getDesc(song) {
      return `${song.singer}·${song.album}`
    },
    getRankCls(index) {
      if (this.numShow === false) {
        if (index <= 2) {
          return `icon icon${index}`
        } else {
          return 'text'
        }
      } else {
        return 'text'
      }
    },
    getRankText(index) {
      return index + 1
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .song-list
    .border-bottom:before
      border-color: rgba(255,255,255,0.4)
    .border-bottom:last-child:before
      border-bottom: none
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 50px
      font-size: $font-size-medium
      .rank
        flex: 0 0 60px
        width: 60px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image-this('first')
          &.icon1
            bg-image-this('second')
          &.icon2
            bg-image-this('third')
        .text
          color: $color-theme
          font-size: 14px
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          font-size: 10px
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>
