import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';

Component({
  options: {
    pureDataPattern: /^_/,
  },
  behaviors: [require('@/common/tab-bar/custom'), require('@/common/toast/simple')],

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
