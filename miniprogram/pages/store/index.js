import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';

import { createStoreBindings } from 'mobx-miniprogram-bindings';

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
    _storeBindings: null,
  },
  lifetimes: {
    attached: async function () {
      // 初始化所需的store/service
      await Promise.all([
        stores.fetchCategory(),
        services.fetchCategory(),

        stores.fetchSpec(),
        services.fetchSpec(),

        // stores.fetchStock(),
        services.fetchStock(),

        stores.fetchGoods(),
        services.fetchGoods(),

        stores.fetchCart(),
        services.fetchCart(),
      ]);

      this._storeBindings = createStoreBindings(this, {
        stores,
        fields: {
          categoryExtList2: function () {
            const categoryExtList = stores.category.categoryExtList || [];
            this.setData({ categoryExtList });
            return [];
          },
          categorySelected: function () {
            return stores.category.selected;
          },
          goods2: function () {
            const selected = stores.goods.selected;
            this.setData({ goods: selected });
            return {};
          },
        },
      });
    },
    detached: function () {
      this._storeBindings.destroyStoreBindings();
    },
  },
});
