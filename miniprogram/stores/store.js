import { configure } from 'mobx-miniprogram';
import { default as goods } from './goods-store';
import { default as cart } from './cart-store';

configure({
  enforceActions: true, // 不允许在动作之外进行状态修改
});
export default {
  goods,
  getSpu: goods.getSpu.bind(goods),
  getSku: goods.getSku.bind(goods),
  getStock: goods.getStock.bind(goods),
  fetchGoodsSpuList: goods.fetchGoodsSpuList.bind(goods),
  switchSelectedGoodsSpuList: goods.switchSelectedGoodsSpuList.bind(goods),

  cart,
  handleCartChange: cart.handleCartChange.bind(cart),
  getCartSkuSumInfo: cart.getCartSkuSumInfo.bind(cart),
};
