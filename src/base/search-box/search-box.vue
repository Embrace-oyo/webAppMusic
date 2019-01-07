<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <div class="border-bottom">
      <input ref="query" v-model="query" class="box" :placeholder="placeholder" />
    </div>
    <i @click="clear" v-show="query.length>0" class="icon-dismiss"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import {debounce} from 'common/js/until'

export default {
  name: 'search-box',
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  methods: {
    clear() {
      this.query = ''
    },
    setQuery(query) {
      this.query = query
    },
    blur() {
      this.$refs.query.blur()
    }
  },
  created() {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 30px
    border-radius: 6px
    position:relative
    &:before
      content: ''
      position:absolute
      left:0
      top:0
      bottom:0
      right:0
      background:rgba(255, 255, 255, 0.5)
      border-radius: 6px
      filter: blur(1px)
      z-index:0
    .icon-search
      font-size: 24px
      color: #fff
     .border-bottom
      flex:1
      display:flex
      .box
        flex: 1
        margin: 0 5px
        line-height: 20px
        background: transparent
        color: $color-text
        font-size: $font-size-medium
        outline: 0
        z-index:10
        &::placeholder
          color: $color-text-d
    .icon-dismiss
      font-size: 16px
      z-index:99
      color: #fff
</style>
