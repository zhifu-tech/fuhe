import log from '@/common/log/log';
import services from '@/services/index';
import stores from '@/stores/index';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  watch: {
    skuCartData: function () {
      const { tag, spuId, skuId, sku } = this.data;
      const notifyData = {};
      sku.stockList?.forEach((stock, index) => {
        const list = stores.cart.getCartRecordList({
          spuId,
          skuId,
          stockId: stock._id,
        });
        if (!list || list.length === 0) return;
        // 对于某个stock，按照首条记录进行更新
        const salePrice = list[0].salePrice;
        const saleQuantity = list[0].saleQuantity;
        if (salePrice && stock.salePrice !== salePrice) {
          notifyData[`sku.stockList[${index}].salePrice`] = salePrice;
          stock.salePrice = salePrice;
        }
        if (saleQuantity && stock.saleQuantity !== saleQuantity) {
          notifyData[`sku.stockList[${index}].saleQuantity`] = saleQuantity;
          stock.saleQuantity = saleQuantity;
        }
      });
      if (Object.keys(notifyData).length > 0) {
        this.setData(notifyData);
      }
      this.updateSummary();
    },
  },
  methods: {
    handleCartChangeEvent: function (e) {
      const { stockId, index } = e.target.dataset;
      const { tag, spuId, skuId } = this.data;
      const stock = stores.goods.getStock(spuId, skuId, stockId);
      if (!stock) return;
      // 更新Stock的数据
      const { salePrice, saleQuantity } = e.detail;
      this.handleCartChange({
        tag: tag + '-cart-event',
        stock,
        index,
        salePrice,
        saleQuantity,
      });
    },
    handleCartChange: async function ({ tag, stock, index, salePrice, saleQuantity }) {
      // 这里的调用比价频繁，需要增加一个机制，避免高频调用。这增加一个队列，
      // 1. 每次处理一次变更，上一个处理结束，下一个处理开始
      // 2. 如果新增加的 变更，正在处理中，则取消执行。
      log.info(tag, 'handleCartChange', index, salePrice, saleQuantity);
      if (stock.saleQuantity === saleQuantity && stock.salePrice === salePrice) {
        return;
      }
      services.cart.cartChange({
        tag,
        stock,
        index,
        salePrice,
        saleQuantity,
        executeFn: this.executeCartChange.bind(this),
      });
    },
    executeCartChange: async function (task) {
      const { tag, stock, index, salePrice, saleQuantity } = task;
      log.info(tag, 'executeCartChange', index, salePrice, saleQuantity);
      const notifyData = {};
      const promises = [];
      if (salePrice && stock.salePrice !== salePrice) {
        // 记录被调整之前的价格，用来判定价格是否被调整过
        if (!stock.originalSalePrice) {
          stock.originalSalePrice = stock.salePrice;
        } else if (stock.originalSalePrice === salePrice) {
          stock.originalSalePrice = undefined;
        }
        notifyData[`sku.stockList[${index}].salePrice`] = salePrice;

        // 库存价格被修改，更新stock的售价
        promises.push(this._saveStockChanges(stock));
      }
      if (saleQuantity && stock.saleQuantity !== saleQuantity) {
        // 销售数量变更
        notifyData[`sku.stockList[${index}].saleQuantity`] = saleQuantity;
      } else if (!saleQuantity && stock.saleQuantity !== 0) {
        // 被删除，需要清空销售数量
        notifyData[`sku.stockList[${index}].saleQuantity`] = 0;
      }
      if (Object.keys(notifyData).length > 0) {
        this.setData(notifyData);
        // 更新store中的数据
        const { spuId, skuId } = this.data;
        promises.push(
          services.cart.updateCartRecord({
            tag,
            spuId,
            skuId,
            stockId: stock._id,
            salePrice: salePrice,
            saleQuantity: saleQuantity,
          }),
        );
      }
      if (promises.length > 0) {
        await Promise.all(promises);
      }
    },
    _saveStockChanges: async function (stock) {
      try {
        await services.stock.updateStockInfo({
          tag: 'stockPricesChange',
          stockId: stock._id,
          salePrice: stock.salePrice,
        });
      } catch (error) {
        log.error('更新库存价格失败', error);
      }
    },
  },
});
