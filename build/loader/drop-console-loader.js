const reg = /(console.log()(.*)())/g
module.exports = function (source) {
  source = source.replace(reg, '')
  console.log('webpack loader options', this.query) // 返回webpack的参数即options的对象
  return source
}
