import log from '@/common/log/log';
import { action } from 'mobx-miniprogram';

export default {
  updateSkuImageList: action(function ({ sku, imageList }) {
    sku.imageList = imageList;
  }),
  addStock: action(function ({ sku, stock }) {
    sku.stockList = sku.stockList || [];
    if (!stock._id) {
      stock._id = `-${sku.stockList.length + 1}`;
    }
    stock.skuId = sku._id;
    sku.stockList.unshift(stock);
  }),
  removeStock: action(function ({ sku, stockId }) {
    sku.stockList = sku.stockList || [];
    sku.stockList = sku.stockList.filter((stock) => stock._id !== stockId);
  }),
};
