import stores from '@/stores/index';
import services from '@/services/index';

Component({
  options: {
    pureDataPattern: /^_/,
  },
  behaviors: [require('@/common/toast/simple'), require('@/common/tab-bar/custom')],
  data: {
    tag: 'dashboardPage',
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

        stores.fetchOrder(),
        services.fetchOrder(),
      ]);
    },
  },
});
