import log from '@/common/log/log';
import fetchGetManager from '@/common/module/fetch-get-manager';

export default fetchGetManager({
  category: async () => require.async('@/package-cso/stores/category/index.js'),
  spec: async () => require.async('@/package-cso/stores/spec/index.js'),
  stock: async () => require.async('@/package-mix/stores/stock/index.js'),
  goods: async () => require.async('@/package-goods/stores/goods/index.js'),
  cart: async () => require.async('@/package-cart/stores/cart/index.js'),
});
