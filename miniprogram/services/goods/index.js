import spuList from './spu-list';
import spuCreate from './spu-create';
import spuUpdate from './spu-update';

import { create as skuCreate, createMany as skuCreateMany } from './sku-create';
import stockList from './stock-list';
import { create as stockCreate, createMany as stockCreateMany } from './stock-create';
import skuUpdate from './sku-update';

export default {
  spuList,
  spuCreate,
  spuUpdate,
  skuCreate,
  skuCreateMany,
  skuUpdate,
  stockList,
  stockCreate,
  stockCreateMany,
};
