<template>
  <div class="song-list">
    <ul v-show="songs.length" class="paddingTop">
      <li @click="selectItem(songs, index)" class="item border-bottom" v-for="(item, index) of songs" :key="index">
        <div class="rank">
          <span>{{index + 1}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{item.name}}</h2>
          <p class="desc">{{item.singer}} - {{item.album}}</p>
        </div>
      </li>
    </ul>
    <Loading v-show="!songs.length" class="load"></Loading>
  </div>
</template>

<script type="text/ecmascript-6">
import Loading from 'base/loading/loading.vue'
export default {
  name: 'singer-song-list',
  components: {
    Loading
  },
  props: {
    songs: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectItem(item, index) {
      this.$emit('select', item, index)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      &:before
        border-color:rgba(234, 234, 234, 0.35);
      .rank
        flex: 0 0 50px
        width: 50px
        text-align: center
        color: $color-text-l
        font-size:$font-size-medium-x
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image-this('~common/image/first')
          &.icon1
            bg-image-this('~common/image/second')
          &.icon2
            bg-image-this('~common/image/third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-l
          font-size:$font-size-small-s
</style>
