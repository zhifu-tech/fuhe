import log from '@/common/log/log';
import { uploadSpuImageList } from '@/common/image/images';
import goodsModel from '../../models/goods/index';

export default async function createGoodsSkuList({ tag, spu }) {
  spu.skuList = spu.skuList || [];
  const tagExtra = `createGoodsSkuList-${spu.title}`;
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
      const skuIdList = await goodsModel.skuCreateMany({
        tag,
        paramList: newSkuList.map((sku) => {
          // 提取销售价格
          const { salePrice } = sku.stockList[0];
          return {
            salePrice,
            imageList: sku.imageList,
            optionIdList: sku.optionList.map((it) => it._id),
            // 如果spu._id以-开头，则移除-; 否则取 spu._id
            spuId: spu._id.replace(/^-/, ''),
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
}
