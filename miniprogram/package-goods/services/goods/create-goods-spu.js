import log from '@/common/log/log';
import goodsModel from '../../models/goods/index';
import goodsStore from '../../stores/goods/index';

export default async function createGoodsSpu({ tag, spu: draft }) {
  try {
    // 尚未创建spu，新建spu
    if (draft._id.startsWith('draft-')) {
      // 1. 创建spu
      const id = await goodsModel.createSpu({
        tag,
        param: {
          // 分类信息
          cId: draft.cId,
          // 供应商信息
          supplierId: draft.supplier?._id || '',
          supplierName: draft.supplier?.name || '',
          // 商品信息
          title: draft.title,
          desc: draft.desc || '',
        },
      });
      // 更新草稿信息
      // 删除原来的spu草稿信息
      goodsStore.deleteGoodsSpu(draft._id);
      // 更新ID,重新添加
      draft._id = id;
      goodsStore.addGoodsSpu({ tag, spu: draft });
    } else {
      log.info(tag, 'createGoodsSpu', 'draft has already been created');
    }
    log.info(tag, 'createGoodsSpu success!', draft);
    return spu;
  } catch (error) {
    log.info(tag, 'createGoodsSpu error!', error);
    throw error;
  }
}
