Component({
  behaviors: [
    require('./behaviors/format'), // 格式化价格
    require('./behaviors/input'), // 输入
  ],
  properties: {
    priceUnit: {
      type: String,
      value: 'fen',
    }, // 价格单位，分 | 元, fen，yuan
    price: {
      type: null,
      value: '',
    }, // 价格, 以分为单位
    type: {
      type: String,
      value: '',
    }, //  main 粗体, lighter 细体, mini 黑色, del 中划线, delthrough 中划线，包括货币符号
    symbol: {
      type: String,
      value: '¥',
    }, // 货币符号，默认是人民币符号￥
    autoFill: {
      type: Boolean,
      value: true,
    }, // 是否自动补齐两位小数
    decimalSmaller: {
      type: Boolean,
      value: true,
    }, // 小数字号小一点
    // 划线价线条高度
    lineThroughWidth: {
      type: null,
      value: '0.12em',
    },
    // 是否为输入模式
    input: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    prices: {
      integer: '0',
      decimal: '00',
      formatted: 0,
    },
  },
});
