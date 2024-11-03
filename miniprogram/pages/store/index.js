import log from '@/common/log/log';
import store from '@/stores/store';

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
    store,
    fields: {
      // categoryExtList: () => store.category.categoryExtList,
      categoryExtList: function () {
        log.info('categoryExtList', 'storePage');
        return store.category.categoryExtList;
      },
      fetchCategoryListStatus: () => store.category.fetchCategoryListStatus,
      categorySelected: () => store.category.selected,
      goods: () => ({ ...store.goods.selected }),
      fetchGoodsSpuListStatus: () => store.goods.fetchGoodsSpuListStatus,
    },
  },
});
