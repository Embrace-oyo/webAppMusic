/* jsonp方法封装 */

// 加载jsonp插件
import originJSONP from 'jsonp'

// 暴露写好的方法
export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  // resolve 代表promise成功  reject代表promise失败
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) { // 未发生错误执行
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
// 平行对象参数
function param(data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
