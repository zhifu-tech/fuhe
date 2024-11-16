import log from '@/common/log/log';
import stores from '@/stores/index';
import pages from '@/common/page/pages';
import { observable, toJS } from 'mobx-miniprogram';

Component({
  options: {
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  behaviors: [
    require('miniprogram-computed').behavior,
    require('@/common/mobx/auto-disposers'),
    require('./behaviors/submit'),
    require('./behaviors/spu'),
    require('./behaviors/spu-submit-add'),
    require('./behaviors/spu-submit-edit'),
    require('./behaviors/sku'),
    require('./behaviors/sku-submit-add'),
    require('./behaviors/sku-submit-edit'),
    require('./behaviors/stock'),
    require('./behaviors/stock-submit-add'),
    require('./behaviors/stock-submit-edit'),
    require('./behaviors/category'),
    require('./behaviors/supplier'),
  ],
  properties: {
    options: {
      type: Object,
      value: {},
    },
  },
  data: {
    tag: 'goods-popup',
  },
  watch: {
    options: function (options) {
      log.info(this.data.tag, 'watch observer. function', options);
      const { spuId, skuId, stockId } = this.properties.options;

      const _spu = spuId && stores.goods.getSpu(spuId);
      const spu = _spu && observable(toJS(_spu));

      const _sku = skuId && stores.goods.getSku(spuId, skuId);
      const sku = _sku && observable(toJS(_sku));

      const _stock = stockId && stores.goods.getStock(spuId, skuId, stockId);
      const stock = _stock && observable(toJS(_stock));

      this.setData({
        ...options, // 展开对象

        _spu: _spu || observable({}),
        spu: spu || observable({}),

        _sku: _sku || observable({}),
        sku: sku || observable({}),

        _stock: _stock || observable({}),
        stock: stock || observable({}),
      });

      this._show();
    },
  },
  methods: {
    _show: function () {
      this._popup((popup) => {
        popup.setData({
          visible: true,
          zIndex: pages.zIndexIncr(),
          overlayProps: {
            zIndex: pages.zIndexOverlay(),
          },
        });
      });
    },
    hide: function () {
      this._popup((popup) => {
        if (popup.data.visible) {
          popup.setData({ visible: false });
        }
        this.data.options?.close?.();
      });
    },
    _popup: function (callback) {
      callback(this.selectComponent('#popup'));
    },
  },
});
