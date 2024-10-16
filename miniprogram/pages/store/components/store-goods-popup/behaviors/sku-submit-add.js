import { uploadSpuImageList } from './images';
import log from '@/common/log/log';
import services from '@/services/index';

module.exports = Behavior({
  observers: {
    'spu.skuList': function () {
      if (this.data.isModeAddSku) {
        this._checkSubmitAddSkuEnabled();
      }
    },
  },
  methods: {
    _checkSubmitAddSkuEnabled: function () {
      const { spu, _spu } = this.data;
      // 如果数据发生变化，则开启提交
      const submitDisabled = spu.skuList.length === _spu.skuList.length;
      if (submitDisabled !== this.data.submitDisabled) {
        this.setData({
          submitDisabled,
        });
      }
    },
    _submitAddSku: async function () {
      const { tag, spu } = this.data;
      try {
        this._submitAddSkuList(spu);

        this.notify();
        this.hideToast();
      } catch (error) {
        log.error(tag, 'update spu error', error);
        this.showToastError('未知错误，稍后重试!');
      } finally {
        this.hide();
      }
    },
    _submitAddSkuList: async function (spu) {
      // 计算新增的sku
      const newSkuList = spu.skuList.filter((sku) => sku._id.startsWith('-'));
      // 上传新增的图片
      await uploadSpuImageList(newSkuList);

      // 提交商品Sku信息
      const skuIdList = await services.goods.skuCreateMany({
        tag,
        paramList: newSkuList.map((sku) => ({
          imageList: sku.imageList,
          optionIdList: sku.optionList.map((it) => it._id),
          spuId: spu._id,
        })),
      });
      skuIdList.forEach(({ id }, index) => {
        newSkuList[index]._id = id;
      });

      // 提交商品SKU的Stock信息
      const stockIdList = await services.goods.stockCreateMany({
        tag,
        paramList: newSkuList.map((sku) => {
          const { quantity, costPrice, salePrice } = sku.stockList[0];
          return {
            quantity,
            costPrice,
            salePrice,
            skuId: sku._id,
          };
        }),
      });
      newSkuList.forEach((sku, index) => {
        sku.stockList[0]._id = stockIdList[index];
      });
    },
  },
});
