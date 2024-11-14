import log from '@/common/log/log';
import stores from '@/stores/index';
import { observable, runInAction, toJS } from 'mobx-miniprogram';

module.exports = Behavior({
  data: {
    submitDisabled: true,
    _submitFn: null,
  },
  methods: {
    submit: function () {
      log.info(this.data.tag, 'submit');
      this.data._submitFn?.();
    },

    handleGoodsAdd: function () {
      const { tag, isModeAddSpu, spu, sku, stock } = this.data;
      if (isModeAddSpu) {
        if (!this.checkSpuTitle(spu)) return;
        if (!this.checkSpuCategory(spu)) return;
        if (!this.checkSpuSpecList(spu)) return;
      }

      if (!this.checkSkuSpecList(spu, sku)) return;
      if (!this.checkSkuImageList(sku)) return;

      if (!this.checkStockCostPrice(stock)) return;
      if (!this.checkStockOriginalPrice(stock)) return;
      if (!this.checkStockQuantity(stock)) return;

      // 装配spu信息
      runInAction(() => {
        // 将当前编辑的spu信息，添加到本地store中
        // 首次新增spu，设置spu的id 为草稿 id=-1;
        // 否则，设置spu的id为 spu的`-${spu._id}`,用来和已有的spu区分
        if (!spu._id || !spu._id.startsWith('-')) {
          spu._id = spu._id ? `-${spu._id}` : '-1';
          // 添加spu到本地的store中，且不参与列表的展示
          stores.goods.addGoodsSpu({ tag, spu, addToList: false });
        }
        // 将当前编辑的sku信息，添加到spu中
        sku.imageList = sku.imageList || [];
        stores.goods.spu.addSku({ tag, spu, sku });

        // 将当前编辑的库存信息，添加到sku中
        stores.goods.sku.addStock({ tag, sku, stock });

        log.info(tag, 'handleGoodsAdd', toJS(spu), toJS(sku), toJS(stock));
      });

      // 重置 sku/stock信息，可以继续添加sku或者提交已有的sku
      this.setData({
        sku: observable({}),
        stock: observable({}),
      });
    },
  },
});
