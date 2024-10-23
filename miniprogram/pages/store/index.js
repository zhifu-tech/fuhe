Component({
  options: {
    pureDataPattern: /^_/,
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
    require('@/common/page/page-status'),
    require('@/common/tab-bar/custom'),
    require('@/pages/store/components/store-category-popup/popup'),
    require('@/pages/store/components/store-goods-popup/popup'),
    require('./behaviors/goods'),
    require('./behaviors/goods-sku'),
    require('./behaviors/goods-spu'),
    require('./behaviors/sidebar'),
    require('./behaviors/header'),
    require('./behaviors/category'),
  ],
  data: {
    tag: 'storePage',
    saasId: '666666',
  },
});
