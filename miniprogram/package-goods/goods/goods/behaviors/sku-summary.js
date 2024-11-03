import log from '@/common/log/log';
import stores from '@/stores/index';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  data: {
    summary: {
      enabled: true,
      salePrice: 0,
      originalPrice: 0,
      saleQuantity: 0,
      originalQuantity: 0,
    },
  },
  watch: {
    cartSkuSumInfo: function (info) {
      this.updateSummary(info);
    },
  },
  methods: {
    updateSummary: function (sumInfo) {
      const { tag, sku, summary } = this.data;
      // 外显的汇总操作，生效的条件：以下条件之一满足时：
      // 1. 库存记录有0条或者1条，
      // 2. 库存记录有N(N>=2)条时，所有库存记录的销售价格，没有被调整过时
      const enabled =
        !sku.stockList ||
        sku.stockList.length === 1 ||
        sku.stockList.every((stock) => !stock.originalSalePrice);
      if (!enabled) {
        if (summary.enabled != enabled) {
          this.setData({ 'summary.enabled': false });
        }
        return;
      }
      let salePrice = sku.salePrice || 0; // 汇总-销售价格: 为所有库存记录销售价格的最大值.
      let originalPrice = 0; // 汇总-原价: 取所有商品的最大的原价.
      let saleQuantity = 0;
      let originalQuantity = 0;
      sku.stockList?.forEach((stock) => {
        if (salePrice < stock.salePrice) {
          salePrice = stock.salePrice;
        }
        if (originalPrice < stock.originalPrice) {
          originalPrice = stock.originalPrice;
        }
        saleQuantity += stock.saleQuantity || 0;
        originalQuantity += stock.quantity || 0;
      });
      const notifyData = {};
      if (!summary.enabled) {
        notifyData['summary.enabled'] = true;
      }
      if (summary.salePrice !== salePrice) {
        notifyData['summary.salePrice'] = salePrice;
      }
      if (summary.originalPrice !== originalPrice) {
        notifyData['summary.originalPrice'] = originalPrice;
      }
      if (summary.saleQuantity !== saleQuantity) {
        notifyData['summary.saleQuantity'] = saleQuantity;
      }
      if (summary.originalQuantity !== originalQuantity) {
        notifyData['summary.originalQuantity'] = originalQuantity;
      }
      this.setData(notifyData);
    },
    handleSummaryCartChangeEvent: function (e) {
      log.info('handleSummaryCartChangeEvent', e);
      const { salePrice, saleQuantity } = e.detail;
      const { summary, spuId, skuId, sku } = this.data;
      if (summary.salePrice !== salePrice) {
        // summary的价格发生变化，需要修改所有已经加入cart的售价
        const notifyData = {
          'summary.salePrice': salePrice,
        };
        sku.stockList?.forEach((stock, index) => {
          log.info('handleSummaryCartChangeEvent', 'summaryPriceChange', index, stock);
          // if (stock.saleQuantity && stock.saleQuantity > 0) {
          // }
          stores.cart.handleCartChange({
            tag: 'summaryPriceChange',
            spuId,
            skuId,
            stockId: stock._id,
            salePrice: salePrice,
            saleQuantity: stock.saleQuantity ?? 0,
          });
          notifyData[`sku.stockList[${index}].salePrice`] = salePrice;
        });
        this.setData(notifyData);
        log.info('handleSummaryCartChangeEvent', 'summaryPriceChange', notifyData);
        return;
      }
      if (summary.saleQuantity === saleQuantity) {
        // 不需要修改数量，直接返回
        return;
      }
      const notifyData = {
        'summary.saleQuantity': saleQuantity,
      };
      // summary的数量发生变化，需要修改所有已经加入cart的数量
      // 根据用户选择的 saleQuantity 数量来动态调整每个 stock 的选中数量。
      // 1.	增加数量: 从首位开始增加库存的选中数量，直到满足 stockSelected。
      // 2.	减少数量: 从末位开始减少库存的选中数量，直到满足 stockSelected。
      if (summary.saleQuantity < saleQuantity) {
        let delta = saleQuantity - summary.saleQuantity;
        sku.stockList?.some((stock, index) => {
          if (stock.saleQuantity === undefined) {
            stock.saleQuantity = 0;
          }
          if (stock.saleQuantity + delta <= stock.quantity) {
            const stockSaleQuantity = stock.saleQuantity + delta;
            stores.cart.handleCartChange({
              tag: 'summaryQuantityChange',
              spuId,
              skuId,
              stockId: stock._id,
              salePrice: stock.salePrice,
              saleQuantity: stockSaleQuantity,
            });
            notifyData[`sku.stockList[${index}].saleQuantity`] = stockSaleQuantity;
            delta = 0;
          } else if (stock.saleQuantity !== stock.quantity) {
            const stockSaleQuantity = stock.quantity;
            stores.cart.handleCartChange({
              tag: 'summaryQuantityChange',
              spuId,
              skuId,
              stockId: stock._id,
              salePrice: stock.salePrice,
              saleQuantity: stock.quantity,
            });
            delta -= stock.quantity - stock.saleQuantity;
            notifyData[`sku.stockList[${index}].saleQuantity`] = stock.quantity;
          }
          return delta === 0;
        });
      } else if (summary.saleQuantity > saleQuantity) {
        let delta = summary.saleQuantity - saleQuantity;
        sku.stockList?.reverse().some((stock, index) => {
          if (!stock.saleQuantity) {
            return false;
          }
          if (stock.saleQuantity - delta >= 0) {
            const stockSaleQuantity = stock.saleQuantity - delta;
            stores.cart.handleCartChange({
              tag: 'summaryQuantityChange',
              spuId,
              skuId,
              stockId: stock._id,
              salePrice: stock.salePrice,
              saleQuantity: stockSaleQuantity,
            });
            notifyData[`sku.stockList[${index}].saleQuantity`] = stockSaleQuantity;
            delta = 0;
          } else if (stock.saleQuantity !== 0) {
            const stockSaleQuantity = 0;
            stores.cart.handleCartChange({
              tag: 'summaryQuantityChange',
              spuId,
              skuId,
              stockId: stock._id,
              salePrice: stock.salePrice,
              saleQuantity: stockSaleQuantity,
            });
            delta -= stock.saleQuantity;
            notifyData[`sku.stockList[${index}].saleQuantity`] = 0;
          }
          return delta === 0;
        });
      }
      this.setData(notifyData);
    },
  },
});
