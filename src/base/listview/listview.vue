<template>
  <Scroll class="listview" :data="data" ref="listview" :probeType="probeType" :listenScroll="listenScroll" @scroll="scroll">
    <ul>
      <li class="list-group" v-for="(group, index) of data" :key="index" ref="listGroup">
        <h2 class="list-group-title" ref="h2">
          <span>{{group.title}}</span>
        </h2>
        <ul>
          <li @click="selectItem(item)" class="list-group-item" v-for="item of group.items" :key="item.id">
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShrotcutTouchStart" @touchmove.stop.prevent="onShrotcutTouchMove">
      <ul>
        <li v-for="(item, index) of shortcutList" :key="index" class="item" :class="{'current': currIndex === index}" :data-index="index" ref="item">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixTop">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </Scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll.vue'
import {getData} from 'common/js/dom.js'
export default {
  name: 'listview',
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  components: {
    Scroll
  },
  data () {
    return {
      currIndex: 0,
      scrollY: -1,
      diff: 0
    }
  },
  computed: {
    shortcutList () {
      let shortcutList = []
      for (let i = 0; i < this.data.length; i++) {
        let title = this.data[i].title.substr(0, 1)
        shortcutList.push(title)
      }
      return shortcutList
    },
    fixedTitle() {
      if (this.data[this.currIndex]) {
        if (this.scrollY <= -1) {
          return ''
        } else {
          return this.data[this.currIndex].title
        }
      }
    }
  },
  methods: {
    refresh() {
      this.$refs.listview.refresh()
    },
    /* 获取scroll中的方法并执行  第二个参数代表缓动动画时间 */
    _scrollTo(index) {
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 5)
    },
    /* 触摸导航事件 */
    onShrotcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0].pageY
      this.touch.y1 = firstTouch
      this.touch.index = anchorIndex
      this._scrollTo(anchorIndex)
    },
    /* 滑动导航事件 */
    onShrotcutTouchMove(e) {
      let firstTouch = e.touches[0].pageY
      this.touch.y2 = firstTouch
      let anchorIndex = Math.floor((this.touch.y2 - this.touch.y1) / this.$refs.item[0].offsetHeight)
      let index = anchorIndex + parseInt(this.touch.index)
      if (index >= 0 && index < this.$refs.listGroup.length) {
        this._scrollTo(index)
      } else {
        return false
      }
    },
    /* 滚动事件监听 */
    scroll(pos) {
      this.scrollY = -pos.y
    },
    /* 获取group的每一个高度 并化成数组 */
    _groupHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        height += list[i].offsetHeight
        this.listHeight.push(height)
      }
    },
    /* 传递给上层组件一个select事件 并传递一个item值 */
    selectItem(item) {
      this.$emit('select', item)
    }
  },
  watch: {
    /* 监听prop接受参数data数据变化 */
    data () {
      setTimeout(() => {
        this._groupHeight()
      }, 20)
    },
    /* 监听data中scrollY参数 数据变化 */
    scrollY(thisY) {
      for (let i = 0; i < this.listHeight.length; i++) {
        if ((thisY < this.listHeight[i + 1] && thisY > this.listHeight[i]) || (thisY === this.listHeight[i] || thisY < this.listHeight[i + 1])) {
          this.currIndex = i
          this.diff = this.listHeight[i + 1] - thisY - this.$refs.h2[0].offsetHeight
          return
        }
      }
    },
    diff(top) {
      let fixedTop = (top <= 0 && top >= -this.$refs.h2[0].offsetHeight) ? top : 0
      this.$refs.fixTop.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  created () {
    this.touch = {}
    this.listenScroll = true
    this.probeType = 3
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        position:relative
        &::before
          content:''
          position:absolute
          left:0
          top:0
          bottom:0
          right:0
          width: 100%
          height:100%
          background:rgba(255, 255, 255, 0.48)
          filter:blur(1px)
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: #64e0bc
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: rgba(255,255,255,0.5);
        position: relative;
        &:before
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: rgba(255,255,255,0.48);
          -webkit-filter: blur(1px);
          filter: blur(1px);
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
