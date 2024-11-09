import pages from '@/common/page/pages';
import { showSimpleActionSheet } from '@/common/action-sheet/simples';

module.exports = Behavior({
  methods: {
    showStockActionMore: function (e) {
      const { stockId, index } = e.target.dataset;
      showSimpleActionSheet({
        items: [
          {
            label: '补货',
            value: '0',
            selectedFn: this._handleEditStock.bind(this, stockId, index),
          },
          {
            label: '补货或修改价格',
            value: '1',
            selectedFn: this._handleEditStockSuper.bind(this, stockId, index),
          },
          {
            label: '新增库存',
            value: '2',
            selectedFn: this._handleAddStock.bind(this, stockId, index),
          },
        ],
      });
    },
    _handleEditStock: function (stockId) {
      require('@/package-goods/goods/popup/popup.js', (popup) => {
        const { spuId, skuId } = this.data;
        popup.showGoodsEditStockPopup(
          pages.currentPage(),
          {
            spuId,
            skuId,
            stockId,
          },
          ({ mod, errMsg }) => {
            console.error(`path: ${mod}, ${errMsg}`);
          },
        );
      });
    },
    _handleEditStockSuper: function (stockId) {
      require('@/package-goods/goods/popup/popup.js', (popup) => {
        const { spuId, skuId } = this.data;
        popup.showGoodsEditStockSuperPopup(
          pages.currentPage(),
          {
            spuId,
            skuId,
            stockId,
          },
          ({ mod, errMsg }) => {
            console.error(`path: ${mod}, ${errMsg}`);
          },
        );
      });
    },
    _handleAddStock: function (stockId) {
      require('@/package-goods/goods/popup/popup.js', (popup) => {
        const { spuId, skuId } = this.data;
        popup.showGoodsAddStockPopup(
          pages.currentPage(),
          {
            spuId,
            skuId,
            stockId,
          },
          ({ mod, errMsg }) => {
            console.error(`path: ${mod}, ${errMsg}`);
          },
        );
      });
    },
  },
});
