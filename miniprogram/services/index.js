import fetchGetManager from '@/common/module/fetch-get-manager';

export default fetchGetManager({
  category: async () => require.async('@/package-cso/services/category/index.js'),
  spec: async () => require.async('@/package-cso/services/spec/index.js'),
  stock: async () => require.async('@/package-mix/services/stock/index.js'),
  goods: async () => require.async('@/package-goods/services/goods/index.js'),
  cart: async () => require.async('@/package-cart/services/cart/index.js'),
});
