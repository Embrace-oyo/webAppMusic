import Vue from 'vue'
// 路由插件加载
import Router from 'vue-router'
// 注册 初始化路由插件
Vue.use(Router)

// 推荐组建
const Recommend = () => import('components/recommend/recommend')
// 歌手组件
const Singer = () => import('components/singer/singer')
// 排行组件
const Rank = () => import('components/rank/rank')
// 搜索组件
const Search = () => import('components/search/search')
// 歌手详情页组件
const SingerDetail = () => import('components/singer-detail/singer-detail')
// 推荐详情组件
const RecommendDetail = () => import('components/recommend-detail/recommend-detail.vue')
// 排行详情组件
const RankDetail = () => import('components/rank/rank-detail.vue')
// 用户中心
const UserCenter = () => import('components/user-center/user-center')

// 配置路由
export default new Router({
  routes: [
    // 默认
    {
      path: '/', // 路由地址路径
      redirect: '/recommend' // path路径更改为此路径
    },
    // 推荐
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: RecommendDetail
        }
      ]
    },
    // 歌手
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    // 排行
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: RankDetail
        }
      ]
    },
    // 搜索
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    // 用户中心
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
