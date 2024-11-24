import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';
import pages from '@/common/page/pages';
import { showToastError } from '@/common/toast/simples';
import { showConfirmDialog } from '@/common/dialog/simples';
import { action } from 'mobx-miniprogram';

module.exports = Behavior({
  methods: {
    handleStockActionIn: function (e) {
      require('@/package-goods/goods/popup/popup.js', (popup) => {
        const { stockId } = e.target.dataset;
        const { spuId, skuId } = this.data;
        popup.showGoodsEditStockPopup(
          pages.currentPage(),
          {
            spuId,
            skuId,
            stockId,
            title: '补货',
          },
          ({ mod, errMsg }) => {
            console.error(`path: ${mod}, ${errMsg}`);
          },
        );
      });
    },
    handleStockActionOut: function (e) {
      if (!this.data.editable) return;
      require('@/package-goods/goods/price-quantity-popup/popup.js', (popup) => {
        const { stockId } = e.target.dataset;
        const { tag, spuId, skuId } = this.data;
        const stock = stores.goods.getStock(spuId, skuId, stockId);
        const preSalePrice = stock.salePrice;
        const preSaleQuantity = stock.saleQuantity;
        popup.show(pages.currentPage(), {
          salePrice: stock.salePrice,
          saleQuantity: stock.saleQuantity,
          originalPrice: stock.originalPrice,
          originalQuantity: stock.quantity,

          change: action(function ({ salePrice, saleQuantity }) {
            stock.salePrice = salePrice;
            stock.saleQuantity = saleQuantity;
          }),
          close: () => {
            if (
              preSalePrice !== stock.salePrice || //
              preSaleQuantity !== stock.saleQuantity
            ) {
              this._notifyCartChange({
                tag,
                spuId,
                skuId,
                stockId,
                salePrice: stock.salePrice,
                saleQuantity: stock.saleQuantity,
              });
            }
          },
        });
      }, ({ mod, errMsg }) => {
        log.error(`path: ${mod}, ${errMsg}`);
      });
    },
    _notifyCartChange: async function ({
      tag, //
      spuId,
      skuId,
      stockId,
      salePrice,
      saleQuantity,
    }) {
      // 更新购物车信息
      try {
        await services.cart.updateCartRecord({
          tag,
          spuId,
          skuId,
          stockId,
          salePrice,
          saleQuantity,
        });
        log.info(tag, 'updateCartRecord', 'success');
      } catch (error) {
        log.error(tag, 'updateCartRecord', error);
        showToastError({ message: '更新购物车信息失败！' });
      }
    },

    handleStockActionEdit: function (e) {
      require('@/package-goods/goods/popup/popup.js', (popup) => {
        const { stockId } = e.target.dataset;
        const { spuId, skuId } = this.data;
        popup.showGoodsEditStockSuperPopup(
          pages.currentPage(),
          {
            spuId,
            skuId,
            stockId,
            title: '补货或修改价格',
          },
          ({ mod, errMsg }) => {
            console.error(`path: ${mod}, ${errMsg}`);
          },
        );
      });
    },
    handleStockActionDelete: function (e) {
      const { stockId } = e.target.dataset;
      const { tag } = this.data;
      showConfirmDialog({
        title: '删除库存',
        content: '删除库存会导致关联的信息不可用？',
        confirmBtn: '确认删除',
        cancelBtn: '取消',
        confirm: () => {
          this._deleteStock({ stockId });
        },
        cancel: (error) => {
          log.info(tag, 'stock-delete', 'cancel', error);
        },
      });
    },
    _deleteStock: async function ({ stockId }) {
      const { tag, sku } = this.data;
      try {
        await services.stock.deleteStockInfo({ tag, sku, _id: stockId });
        log.info(tag, 'stock-delete', 'success');
      } catch (error) {
        log.error(tag, 'stock-delete', error);
        showToastError({ message: '删除库存失败！' });
      }
    },
    handleStockActionAdd: async function () {
      require('@/package-goods/goods/popup/popup.js', (popup) => {
        const { spuId, skuId } = this.data;
        popup.showGoodsAddStockPopup(
          pages.currentPage(),
          {
            spuId,
            skuId,
          },
          ({ mod, errMsg }) => {
            console.error(`path: ${mod}, ${errMsg}`);
          },
        );
      });
    },
  },
});
