Component({
  behaviors: [
    require('./behaviors/sku'),
    require('./behaviors/specs'),
    require('./behaviors/stock'),
    require('./behaviors/stock-more'),
    require('./behaviors/sku-add'),
    require('./behaviors/sku-delete'),
    require('./behaviors/sku-more'),
  ],
  options: {
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  properties: {
    spu: {
      type: Object,
      value: {},
    },
    sku: {
      type: Object,
      value: {},
    },
    stock: {
      type: Object,
      value: {},
    },
    editable: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    tag: 'goods',
  },
});
