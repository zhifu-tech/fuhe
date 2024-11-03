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
  spec,
  goods,
  cart,
};
