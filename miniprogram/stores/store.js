import { configure } from 'mobx-miniprogram';
import { default as goods } from './goods-store';
import { default as cart } from './cart-store';
import { default as category } from './category-store';
import { default as spec } from './spec-store';

configure({
  enforceActions: true, // 不允许在动作之外进行状态修改
});
export default {
  category,
  // actions
  fetchCategoryList: category.fetchCategoryList.bind(category),
  switchSelectedCategory: category.switchSelectedCategory.bind(category),
  addCategory: category.addCategory.bind(category),
  deleteCategory: category.deleteCategory.bind(category),
  updateCategory: category.updateCategory.bind(category),

  spec,
  // actions
  fetchSpecList: spec.fetchSpecList.bind(spec),

  goods,
  // actions
  getSpu: goods.getSpu.bind(goods),
  getSku: goods.getSku.bind(goods),
  getStock: goods.getStock.bind(goods),
  fetchGoodsSpuList: goods.fetchGoodsSpuList.bind(goods),
  switchSelectedGoodsSpuList: goods.switchSelectedGoodsSpuList.bind(goods),

  cart,
  // actions
  handleCartChange: cart.handleCartChange.bind(cart),
  getCartSkuSumInfo: cart.getCartSkuSumInfo.bind(cart),
};
