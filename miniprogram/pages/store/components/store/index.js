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

    require('./behaviors/skeleton'),
    require('./behaviors/page-status'),
    require('./behaviors/pull-down-refresh'),
    require('./behaviors/goods'),
    require('./behaviors/goods-popup'),
    require('./behaviors/sidebar'),
    require('./behaviors/category'),
    require('./behaviors/category-popup'),
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
