import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';
import { autorun } from 'mobx-miniprogram';

Component({
  options: {
    pureDataPattern: /^_/,
  },
  behaviors: [
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
  lifetimes: {
    attached: async function () {
      // 初始化所需的store/service
      await Promise.all([
        stores.fetchCategory(),
        services.fetchCategory(),

        stores.fetchSpec(),
        services.fetchSpec(),

        stores.fetchStock(),
        services.fetchStock(),

        stores.fetchGoods(),
        services.fetchGoods(),

        stores.fetchCart(),
        services.fetchCart(),
      ]);

      this.disposers = [
        autorun(() => {
          const selected = stores.category.selected;
          if (this.data.categorySelected != selected) {
            log.info(this.data.tag, 'categorySelected', selected);
            this.setData({ categorySelected: selected });
          }
        }),
        autorun(() => {
          const categoryExtList = stores.category.categoryExtList || [];
          log.info(this.data.tag, 'categoryExtList', categoryExtList);
          this.setData({ categoryExtList });
        }),
        autorun(() => {
          // 保存一个映射，方便后续使用
          const goodsSelected = stores.goods.selected;
          log.info(this.data.tag, 'goodsSelected', goodsSelected);
          this.setData({ goodsSelected });
        }),
        autorun(() => {
          const goodsSpuList = stores.goods.selected.spuList || [];
          log.info(this.data.tag, 'goodsSpuList', goodsSpuList.length);
          this.setData({ goodsSpuList });
        }),
      ];
    },
    detached: function () {
      disposers?.every((disposer) => disposer());
      disposers = null;
    },
  },
});
