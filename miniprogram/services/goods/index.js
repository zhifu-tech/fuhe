import log from '@/common/log/log';
import { uploadSpuImageList } from '@/common/image/images';
import goodsStore from '@/stores/goods-store';
import spuList from './spu-list';
import services from '@/services/index';

import _spuCreate from './spu-create';
import _spuUpdate from './spu-update';
import _skuDelete from './sku-delete';

import { createMany as _skuCreateMany } from './sku-create';

import {
  updateImageList as skuUpdateImageList,
  updateSaleInfo as skuUpdateSaleInfo,
} from './sku-update';

import { saasId } from '../../common/saas/saas';

export default (function () {
  const tagService = 'goods-services';

  return {
    spuList,

    skuCreate: _spuCreate,
    skuCreateMany: _skuCreateMany,
    skuUpdateImageList,
    skuUpdateSaleInfo,
    skuDelete: _skuDelete,

    createGoodsSpu: async function ({ tag, spu }) {
      const id = await _spuCreate({
        tag,
        saasId: saasId(),
        cId: spu.cId,
        title: spu.title,
        desc: spu.desc || '',
      });
      spu._id = id;
    },
    createGoodsSkuList: async function ({ tag, spu }) {
      spu.skuList = spu.skuList || [];
      const tagExtra = `${tagService}-createGoodsSkuList-${spu.title}`;
      try {
        // 上传新增的图片
        await uploadSpuImageList(spu.skuList);
        log.info(tag, tagExtra, 'upload spu image success!');
      } catch (error) {
        log.info(tag, tagExtra, 'upload spu image error!', error);
        throw error;
      }
      // 过滤新增的sku
      const newSkuList = spu.skuList.filter((sku) => sku._id.startsWith('-')) || [];
      if (newSkuList.length > 0) {
        try {
          // 新建sku信息
          const skuIdList = await _skuCreateMany({
            tag,
            paramList: newSkuList.map((sku) => {
              // 提取销售价格
              const { salePrice } = sku.stockList[0];
              return {
                salePrice,
                imageList: sku.imageList,
                optionIdList: sku.optionList.map((it) => it._id),
                spuId: spu._id,
              };
            }),
          });
          // 更新sku信息
          skuIdList.forEach(({ id }, index) => {
            newSkuList[index]._id = id;
            // 更新库存的关联的skuId
            newSkuList[index].stockList?.forEach((stock) => {
              stock.skuId = id;
            });
          });
          log.info(tag, tagExtra, 'createSkuList success');
        } catch (error) {
          log.info(tag, tagExtra, 'createSkuList error', error);
          throw error;
        }
      }
    },
    updateGoodsSpu: async function ({ tag, spu, title, desc }) {
      try {
        await _spuUpdate({
          tag,
          spuId: spu._id,
          title,
          desc,
        });
        goodsStore.updateGoodsSpu({ tag, spu });
      } catch (error) {
        log.error(tag, 'update spu error', error);
        throw error;
      }
    },
    deleteGoodsSku: async function ({ tag, spuId, skuId }) {
      try {
        await _skuDelete({ tag, _id: skuId });
        goodsStore.deleteGoodsSku({ tag, spuId, skuId });
      } catch (error) {
        log.error(tag, 'delete sku error', error);
        throw error;
      }
    },
  };
})();
