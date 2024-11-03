import models from '@/models/index';

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

  skuUpdateImageList: models.goods.skuUpdateImageList,
  skuUpdateSaleInfo: models.goods.skuUpdateSaleInfo,
};
