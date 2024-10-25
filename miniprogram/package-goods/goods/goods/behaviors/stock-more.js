import pages from '@/common/page/pages';
import { showSimpleActionSheet } from '@/common/action-sheet/simples';

module.exports = Behavior({
  methods: {
    showStockActionMore: function (e) {
      const { stock, index } = e.target.dataset;
      showSimpleActionSheet({
        items: [
          {
            label: '补货',
            value: '0',
          },
          {
            label: '补货或修改价格',
            value: '1',
          },
        ],
        selected: (value) => {
          switch (value) {
            case '0': {
              this._handleEditStock(stock, index);
              break;
            }
            case '1': {
              this._handleEditStockSuper(stock, index);
            }
          }
        },
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
