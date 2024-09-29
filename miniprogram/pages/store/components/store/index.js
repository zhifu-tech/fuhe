Component({
  behaviors: [
    require('./behaviors/store-sidebar'), // 侧边栏
    require('./behaviors/store-category'), // 分类
    require('./behaviors/store-category-popup'), // 分类
    require('./behaviors/store-spec'), // 规格信息
    require('./behaviors/store-goods-popup'), // 商品
  ],
  data: {
    tag: 'storePage',
    saasId: '666666',
  },
  pageLifetimes: {
    show() {
      this._init();
    },
  },
  methods: {
    _init: function () {
      this._initCategory(); // 初始化分类信息
      this._initSpec(); //初始化规格信息
    },
  },
});
