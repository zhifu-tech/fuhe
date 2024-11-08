import spuList, { spuListByIdList } from './spu-list';
import spuCreate from './spu-create';
import spuUpdate from './spu-update';

import {
  create as skuCreate, //
  createMany as skuCreateMany,
} from './sku-create';

import {
  updateImageList as skuUpdateImageList,
  updateSaleInfo as skuUpdateSaleInfo,
} from './sku-update';

export default {
  spuCreate,
  spuList,
  spuListByIdList,
  spuUpdate,

  skuCreate,
  skuCreateMany,
  skuUpdateImageList,
  skuUpdateSaleInfo,
};
