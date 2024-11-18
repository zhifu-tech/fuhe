Component({
  options: {
    pureDataPattern: /^_/,
  },
  behaviors: [require('@/common/toast/simple'), require('@/common/tab-bar/custom')],
  data: {
    tag: 'dashboardPage',
  },
});
