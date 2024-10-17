import spuList from './spu-list';
import spuCreate from './spu-create';
import spuUpdate from './spu-update';

import skuUpdate from './sku-update';
import { create as skuCreate, createMany as skuCreateMany } from './sku-create';
import skuDelete from './sku-delete';

export default {
  spuList,
  spuCreate,
  spuUpdate,

  skuCreate,
  skuCreateMany,
  skuUpdate,
  skuDelete,
};
