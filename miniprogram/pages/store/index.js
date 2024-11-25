import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';

Component({
  options: {
    pureDataPattern: /^_/,
  },
  behaviors: [
    require('@/common/mobx/auto-disposers'),
    require('@/common/picker/simple'),
    require('@/common/action-sheet/simple'),
    require('@/common/toast/simple'),
    require('@/common/dialog/simple'),
    require('@/common/page/page-status'),
    require('@/common/tab-bar/custom'),
    require('./behaviors/goods'),
    require('./behaviors/search'),
    require('./behaviors/sidebar'),
    require('./behaviors/header'),
    require('./behaviors/category'),
    require('./behaviors/menu'),
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

        stores.fetchEntity(),
        services.fetchEntity(),
      ]);
      this.setData({ hostAttached: true });
      log.info('hostAttached', 'attached');
    },
  },
});
