const { default: log } = require('@/common/log/log');
const { default: pages } = require('../../../../../common/page/pages');

module.exports = Behavior({
  methods: {
    showStockActionMore: function (e) {
      const { stock, index } = e.target.dataset;
      pages
        .currentPage()
        .root()
        ?.showActionSheet({
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
      const { spu, sku } = this.data;
      pages
        .currentPage()
        .root()
        .showGoodsEditStockPopup({
          spu,
          sku,
          stock,
          callback: () => {
            this.setData({
              [`sku.stockList[${index}]`]: stock,
            });
          },
        });
    },
    _handleEditStockSuper: function (stock, index) {
      const { spu, sku } = this.data;
      pages
        .currentPage()
        .root()
        .showGoodsEditStockSuperPopup({
          spu,
          sku,
          stock,
          callback: () => {
            this.setData({
              [`sku.stockList[${index}]`]: stock,
            });
          },
        });
    },
  },
});
