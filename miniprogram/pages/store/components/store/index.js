Component({
  options: {
    virtualHost: true,
  },
  behaviors: [
    ...require('@/common/debug/debug').behaviors({
      tag: 'store',
      debug: true,
      debugLifecycle: true,
      debugPageLifecycler: true,
    }),
    require('@/common/picker/simple'),
    require('@/common/action-sheet/simple'),
    require('@/common/toast/simple'),
    require('@/common/dialog/simple'),

    require('../store-category-popup/popup'),
    require('../store-goods-popup/popup'),

    require('./behaviors/skeleton'),
    require('./behaviors/page-status'),
    require('./behaviors/pull-down-refresh'),
    require('./behaviors/goods'),
    require('./behaviors/goods-sku'),
    require('./behaviors/goods-spu'),
    require('./behaviors/sidebar'),
    require('./behaviors/category'),
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
      await Promise.all([this._initCategory(), this._initGoods()]);
      this.hideSkeleton();
    },
  },
});
