function getRando(min, max) {
  console.log()
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  // 这里需要特别注意 关于数组洗牌 如果原数组不加slice()方法 也会被改变
  let newArr = arr.slice()
  for (let i = 0; i < newArr.length; i++) {
    let j = getRando(0, i)
    let t = newArr[i]
    newArr[i] = newArr[j]
    newArr[j] = t
  }
  return newArr
}

export function debounce(fuc, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fuc.apply(this, args)
    }, delay)
  }
}
