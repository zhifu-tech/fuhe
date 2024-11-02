import log from '@/common/log/log';
import store from '@/stores/store';
import spuList from '../../services/goods/spu-list';

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
      categoryList: () => store.category.categoryList,
      categoryExtList: () => store.category.categoryExtList,
      categorySelected: () => store.category.selected,
      fetchCategoryListStatus: () => store.category.fetchCategoryListStatus,
      // goods: () => ({ ...store.goods.selected }),
      goods: function () {
        const goods = store.goods.selected;
        return { ...goods };
      },
      fetchGoodsSpuListStatus: () => store.goods.fetchGoodsSpuListStatus,
    },
  },
});
