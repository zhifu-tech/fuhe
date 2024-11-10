Component({
  behaviors: [
    require('miniprogram-computed').behavior,
    require('./behaviors/mode'),
    require('./behaviors/popup'),
  ],
  options: {
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  data: {
    tag: 'cart-cart',
  },
});
