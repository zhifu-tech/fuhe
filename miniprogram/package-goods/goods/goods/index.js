import log from '@/common/log/log';
import stores from '@/stores/index';

Component({
  behaviors: [
    require('mobx-miniprogram-bindings').storeBindingsBehavior,
    require('miniprogram-computed').behavior,
    require('./behaviors/spec-list'),
    require('./behaviors/stock-more'),
    require('./behaviors/stock-cart'),
    require('./behaviors/sku-add'),
    require('./behaviors/sku-delete'),
    require('./behaviors/sku-more'),
  ],
  options: {
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  properties: {
    spuId: String,
    skuId: String,
    stockId: String,
    tagSuffix: String,
    editable: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    tag: 'goods',
  },
  observers: {
    tagSuffix: function (tagSuffix) {
      this.setData({ tag: `goods-${tagSuffix}` });
    },
  },
  storeBindings: {
    stores,
    fields: {
      spu2: function () {
        // 在 mobx-miniprogram 中，通过 storeBindings 将 observable 对象绑定到小程序组件的 data 上时，
        // 会将这些 observable 的属性值复制到组件的 data 中，而不是直接将 observable 对象本身提供给组件。
        // 这会导致通过 this.data.obj 访问到的对象是一个普通的 JavaScript 对象，而不是 observable。
        // 这里为了绕过这个限制，这里增加一个字段，然后通过setData更新。
        const { spuId } = this.properties;
        const spu = stores.goods.getSpu(spuId);
        log.info(this.data.tag, 'spu changed');
        this.setData({ spu });
        return spu || {};
      },
      sku2: function () {
        const { spuId, skuId } = this.properties;
        const sku = stores.goods.getSku(spuId, skuId);
        log.info(this.data.tag, 'sku changed', this.data.spu?.title);
        this.setData({ sku });
        return sku || {};
      },
      skuCartData2: function () {
        const { spuId, skuId } = this.properties;
        const data = stores.cart.getSkuCartData(skuId);
        log.info(this.data.tag, 'skuCartData', this.data.spu?.title);
        this.setData({ skuCartData: data });
        return data || {};
      },
    },
  },
});
