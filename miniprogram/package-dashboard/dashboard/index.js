Component({
  options: {
    pureDataPattern: /^_/,
    virtualHost: true,
  },
  behaviors: [
    require('miniprogram-computed').behavior, //
    require('@/common/mobx/auto-disposers'),
    require('@/common/page/page-status'),
    require('./behaviors/store-summary').default,
    // require('./behaviors/goods-summary'),
    require('./behaviors/income-summary'),
  ],
  data: {
    tag: 'dashboardPage',
  },
  lifetimes: {
    attached: function () {
      this.setData({
        hostAttached: true,
      });
    },
  },
  methods: {
    pullDownRefresh: function () {
      this.refreshIncomeData('pull-down');
      this.refreshStoreData('pull-down');
    },
  },
});
