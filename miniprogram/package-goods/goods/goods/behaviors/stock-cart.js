import log from '@/common/log/log';
import services from '@/services/index';
import stores from '@/stores/index';
import { runInAction } from 'mobx-miniprogram';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  watch: {
    skuCartData: function () {
      const { spuId, skuId, sku } = this.data;
      // 当购物车数据变化时，需要同步stock更新数据
      runInAction(() => {
        sku?.stockList?.forEach((stock) => {
          const list = stores.cart.getCartRecordList({
            spuId,
            skuId,
            stockId: stock._id,
          });
          if (list && list.length > 0) {
            const { salePrice, saleQuantity } = list[0];
            if (salePrice && stock.salePrice !== salePrice) {
              stock.salePrice = salePrice;
            }
            if (saleQuantity && stock.saleQuantity !== saleQuantity) {
              stock.saleQuantity = saleQuantity;
            }
          }
        });
      });
    },
  },
  methods: {
    handleCartChangeEvent: async function (e) {
      // 更新Stock的数据
      // 这里的调用比价频繁，需要增加一个机制，避免高频调用。这增加一个队列，
      // 1. 每次处理一次变更，上一个处理结束，下一个处理开始
      // 2. 如果新增加的 变更，正在处理中，则取消执行。
      const { stockId, index } = e.target.dataset;
      const { salePrice, saleQuantity } = e.detail;
      services.cart.enqueueCartChange({
        options: {
          stockId,
          index,
          salePrice,
          saleQuantity,
        },
        executeFn: this.executeCartChange.bind(this),
      });
    },
    executeCartChange: async function ({ stockId, index, salePrice, saleQuantity }) {
      const { tag, spuId, skuId } = this.data;
      const stock = stores.goods.getStock(spuId, skuId, stockId);
      log.info(tag, 'executeCartChange', index, salePrice, saleQuantity);
      // 判断是否需要更新
      if (!stock || (stock.saleQuantity === saleQuantity && stock.salePrice === salePrice)) {
        return;
      }
      const promises = [];

      runInAction(() => {
        if (salePrice && stock.salePrice !== salePrice) {
          // 库存价格被修改，更新stock的售价
          stock.salePrice = salePrice;

          // 销售价格，需要持久化保存
          promises.push(this._saveStockChanges(stock));
        }
        if (saleQuantity && stock.saleQuantity !== saleQuantity) {
          // 销售数量变更
          stock.saleQuantity = saleQuantity;
        } else if (!saleQuantity && stock.saleQuantity !== 0) {
          // 被删除，需要清空销售数量
          stock.saleQuantity = 0;
        }
      });
      // 更新store中的数据
      promises.push(
        services.cart.updateCartRecord({
          tag,
          spuId,
          skuId,
          stockId,
          salePrice,
          saleQuantity,
        }),
      );

      if (promises.length > 0) {
        await Promise.all(promises);
      }
    },
    _saveStockChanges: async function (stock) {
      try {
        await services.stock.updateStockInfo({
          tag: 'stockPricesChange',
          stock,
          salePrice: stock.salePrice,
        });
      } catch (error) {
        log.error('更新库存价格失败', error);
      }
    },
  },
});
