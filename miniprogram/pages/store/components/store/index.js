Component({
  options: {
    virtualHost: true,
  },
  behaviors: [
    require('./behaviors/skeleton'),
    require('./behaviors/page-status'),
    require('./behaviors/pull-down-refresh'),
    require('./goods/goods'),
    require('./behaviors/store-sidebar'), // 侧边栏
    require('./behaviors/store-category'), // 分类
    require('./behaviors/store-category-popup'), // 分类
    require('./behaviors/store-spec'), // 规格信息
    require('./behaviors/store-goods-popup'), // 商品
    require('../store-picker/picker'),
    require('@/common/action-sheet/action-sheets'),
    ...require('@/common/debug/debug').behaviors({
      tag: 'store',
      debug: true,
      debugLifecycle: true,
      debugPageLifecycler: true,
    }),
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
    _init: async function () {
      await this._initCategory();
      await this._initGoods();
      this.hideSkeleton();
    },
  },
});
