import goodsModel from '../../models/goods/index';

import createGoodsSpu from './create-goods-spu';
import createGoodsSkuList from './create-goods-sku-list';
import fetchGoodsSpuList from './fetch-goods-spu-list';
import switchGoodsSpuList from './switch-goods-spu-list';
import updateGoodsSpu from './update-goods-spu';
import deleteGoodsSku from './delete-goods-sku';

export default {
  createGoodsSpu,
  fetchGoodsSpuList,
  switchGoodsSpuList,
  createGoodsSkuList,
  updateGoodsSpu,
  deleteGoodsSku,

  skuUpdateImageList: goodsModel.skuUpdateImageList,
  skuUpdateSaleInfo: goodsModel.skuUpdateSaleInfo,
};
