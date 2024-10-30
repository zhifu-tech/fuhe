import store from '@/stores/store';

Component({
  options: {
    pureDataPattern: /^_/,
  },
  behaviors: [
    ...require('@/common/debug/debug').behaviors({
      tag: 'store',
      debug: true,
      debugLifecycle: true,
      debugPageLifecycle: true,
    }),
    require('mobx-miniprogram-bindings').storeBindingsBehavior,
    require('miniprogram-computed').behavior,
    require('@/common/picker/simple'),
    require('@/common/action-sheet/simple'),
    require('@/common/toast/simple'),
    require('@/common/dialog/simple'),
    require('@/common/page/page-status'),
    require('@/common/tab-bar/custom'),
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
  storeBindings: {
    store,
    fields: {
      goods: () => store.goods.selected,
      fetchGoodsSpuListStatus: () => store.goods.fetchGoodsSpuListStatus,
    },
    actions: {
      fetchGoodsSpuList: 'fetchGoodsSpuList',
      switchSelectedGoodsSpuList: 'switchSelectedGoodsSpuList',
    },
  },
});
