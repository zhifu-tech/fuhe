import log from '@/common/log/log';
import stores from '@/stores/index';
import cartStore from '../../stores/index';

Component({
  behaviors: [
    require('mobx-miniprogram-bindings').storeBindingsBehavior,
    require('miniprogram-computed').behavior,
    require('./behaviors/mode'),
    require('./behaviors/fab'),
  ],
  options: {
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  data: {
    tag: 'cart-cart',
  },
  storeBindings: {
    stores,
    fields: {
      recordList: function () {
        const recordList = cartStore.dataList;
        log.info(this.data.tag, 'recordList', recordList);
        return [...recordList];
      },
    },
  },
});
