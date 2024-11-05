import stores from '@/stores/index';

Component({
  options: {
    pureDataPattern: /^_/,
  },
  behaviors: [
    require('mobx-miniprogram-bindings').storeBindingsBehavior,
    require('miniprogram-computed').behavior,
    require('@/common/picker/simple'),
    require('@/common/action-sheet/simple'),
    require('@/common/toast/simple'),
    require('@/common/dialog/simple'),
    require('@/common/page/page-status'),
    require('@/common/tab-bar/custom'),
    require('./behaviors/goods'),
    require('./behaviors/sidebar'),
    require('./behaviors/header'),
    require('./behaviors/category'),
  ],
  data: {
    tag: 'storePage',
  },
  storeBindings: {
    stores,
    fields: {
      // categoryExtList: () => stores.category.categoryExtList,
      categoryExtList: function () {
        return stores.category.categoryExtList;
      },
      fetchCategoryListStatus: () => stores.category.fetchCategoryListStatus,
      categorySelected: () => stores.category.selected,
      goods: () => ({ ...stores.goods.selected }),
      fetchGoodsSpuListStatus: () => stores.goods.fetchGoodsSpuListStatus,
    },
  },
});
