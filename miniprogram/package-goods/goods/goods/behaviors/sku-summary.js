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
    skuCartData: function () {
      // sku 记录发生变化时，更新汇总信息
      this.updateSummary();
    },
  },
  methods: {
    updateSummary: function () {
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
        log.info(tag, 'updateSummary', 'disabled');
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
      const { tag, summary, sku } = this.data;
      if (summary.salePrice !== salePrice) {
        // summary的价格发生变化，需要修改所有已经加入cart的售价
        sku.stockList?.forEach((stock, index) => {
          // 调用stock-cart中的方法修改
          this.handleCartChange({
            tag: tag + '-summary',
            stock,
            index,
            salePrice: salePrice,
            saleQuantity: stock.saleQuantity ?? 0,
          });
        });
        this.setData({
          'summary.salePrice': salePrice,
        });
        return;
      }
      if (summary.saleQuantity === saleQuantity) {
        // 不需要修改数量，直接返回
        return;
      }
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
            this.handleCartChange({
              tag: tag + '-summary-2',
              stock,
              index,
              salePrice: stock.salePrice,
              saleQuantity: stockSaleQuantity,
            });
            delta = 0;
          } else if (stock.saleQuantity !== stock.quantity) {
            this.handleCartChange({
              tag: tag + '-summary-3',
              stock,
              index,
              salePrice: stock.salePrice,
              saleQuantity: stock.quantity,
            });
            delta -= stock.quantity - stock.saleQuantity;
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
            this.handleCartChange({
              tag: tag + '-summary-4',
              stock,
              index: sku.stockList.length - 1 - index,
              salePrice: stock.salePrice,
              saleQuantity: stockSaleQuantity,
            });
            delta = 0;
          } else if (stock.saleQuantity !== 0) {
            const stockSaleQuantity = 0;
            stores.cart.handleCartChange({
              tag: tag + '-summary-5',
              stock,
              index: sku.stockList.length - 1 - index,
              salePrice: stock.salePrice,
              saleQuantity: stockSaleQuantity,
            });
            delta -= stock.saleQuantity;
          }
          return delta === 0;
        });
      }
      this.setData({
        'summary.saleQuantity': saleQuantity,
      });
    },
  },
});
