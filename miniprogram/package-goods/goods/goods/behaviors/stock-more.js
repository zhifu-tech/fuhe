import pages from '@/common/page/pages';
import { showSimpleActionSheet } from '@/common/action-sheet/simples';
import stores from '@/stores/index';

module.exports = Behavior({
  methods: {
    showStockActionMore: function (e) {
      const { spuId, skuId } = this.data;
      const { stockId, index } = e.target.dataset;
      const stock = stores.goods.getStock(spuId, skuId, stockId);
      showSimpleActionSheet({
        items: [
          {
            label: '补货',
            value: '0',
            selectedFn: this._handleEditStock.bind(this, stock, index),
          },
          {
            label: '补货或修改价格',
            value: '1',
            selectedFn: this._handleEditStockSuper.bind(this, stock, index),
          },
        ],
      });
    },
    _handleEditStock: function (stock, index) {
      require('@/package-goods/goods/popup/popup.js', (popup) => {
        const { spu, sku } = this.data;
        popup.showGoodsEditStockPopup(
          pages.currentPage(),
          {
            spu,
            sku,
            stock,
            callback: () => {
              this.setData({
                [`sku.stockList[${index}]`]: stock,
              });
            },
          },
          ({ mod, errMsg }) => {
            console.error(`path: ${mod}, ${errMsg}`);
          },
        );
      });
    },
    _handleEditStockSuper: function (stock, index) {
      require('@/package-goods/goods/popup/popup.js', (popup) => {
        const { spu, sku } = this.data;
        popup.showGoodsEditStockSuperPopup(
          pages.currentPage(),
          {
            spu,
            sku,
            stock,
            callback: () => {
              this.setData({
                [`sku.stockList[${index}]`]: stock,
              });
            },
          },
          ({ mod, errMsg }) => {
            console.error(`path: ${mod}, ${errMsg}`);
          },
        );
      });
    },
  },
});
