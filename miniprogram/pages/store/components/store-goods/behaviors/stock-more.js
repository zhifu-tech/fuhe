import { showSimpleActionSheet } from '../../../../../common/action-sheet/simples';
import {
  showGoodsEditStockPopup,
  showGoodsEditStockSuperPopup,
} from '../../store-goods-popup/popups';

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
      const { spu, sku } = this.data;
      showGoodsEditStockPopup({
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
      showGoodsEditStockSuperPopup({
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
