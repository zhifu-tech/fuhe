// pages/store/components/store-header/index.js
Page({
  options: {
    virtualHost: true,
  },
  externalClasses: ['class'],
  relations: {
    '../store': {
      type: 'ancestor',
      linked(target) {
        this.store = target;
        log.info('linked', target);
      },
    },
  },
});
