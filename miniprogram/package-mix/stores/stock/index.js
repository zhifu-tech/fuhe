import log from '@/common/log/log';
import { action } from 'mobx-miniprogram';

export default {
  updateStockInfo: action(function ({ tag, stock, quantity, costPrice, originalPrice }) {
    if (quantity != null) {
      stock.quantity = quantity;
    }
    if (costPrice != null) {
      stock.costPrice = costPrice;
    }
    if (originalPrice != null) {
      stock.originalPrice = originalPrice;
    }
  }),
};
