import goodsModel from '../../models/goods/index';

import createGoodsSpu from './create-goods-spu';
import createGoodsSkuList from './create-goods-sku-list';
import fetchGoodsSpuList, { fetchGoodsSpuListFlow } from './fetch-goods-spu-list';
import fetchGoodsSpuListByIdList, {
  fetchGoodsSpuListAsync,
} from './fetch-goods-spu-list-by-id-list';
import getGoodsSpuList from './get-goods-spu-list';
import switchGoodsSpuList, { checkNeedFetchedData } from './switch-goods-spu-list';
import updateGoodsSpu from './update-goods-spu';
import deleteGoodsSku from './delete-goods-sku';

export default {
  createGoodsSpu,
  fetchGoodsSpuList,
  fetchGoodsSpuListFlow,
  fetchGoodsSpuListByIdList,
  fetchGoodsSpuListAsync,
  switchGoodsSpuList,
  checkNeedFetchedData,
  createGoodsSkuList,
  updateGoodsSpu,
  deleteGoodsSku,
  getGoodsSpuList,

  skuUpdateImageList: goodsModel.skuUpdateImageList,
  skuUpdateSaleInfo: goodsModel.skuUpdateSaleInfo,
};
