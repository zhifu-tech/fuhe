import log from '@/common/log/log';

Component({
  behaviors: [
    require('miniprogram-computed').behavior,
    require('@/common/mobx/auto-disposers'),
    require('@/common/page/page-status'),

    require('./behaviors/tabs'),
    require('./behaviors/content'),
    require('./behaviors/archive'),
    require('./behaviors/cart'),
    require('./behaviors/search'),
  ],
  options: {
    pureDataPattern: /^_/,
    virtualHost: true,
  },
  data: {
    tag: 'order-list',
  },
  lifetimes: {
    attached: function () {
      this.setData({
        hostAttached: true,
      });
      log.info('hostAttached', 'attached');
    },
  },
});
