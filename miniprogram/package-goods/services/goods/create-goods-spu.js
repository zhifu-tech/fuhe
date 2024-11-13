import log from '@/common/log/log';
import { saasId } from '@/common/saas/saas';
import goodsModel from '../../models/goods/index';
import goodsStore from '../../stores/goods/index';
import { runInAction } from 'mobx-miniprogram';

export default async function createGoodsSpu({ tag, spu: draft }) {
  try {
    // 1. 创建spu
    const id = await goodsModel.spuCreate({
      tag,
      saasId: saasId(),
      cId: draft.cId,
      title: draft.title,
      desc: draft.desc || '',
      supplierId: draft.supplier?._id || '',
      supplierName: draft.supplier?.name || '',
    });

    // 2. 需要从store中删除原来的spu，然后重新添加 // fixme 为什么不set ？？
    runInAction(() => {
      goodsStore.deleteGoodsSpu(draft._id);
      // 更新ID,重新添加
      draft._id = id;
      draft.supplierId = draft.supplier._id;
      draft.suppliername = draft.supplier.name;
      goodsStore.addGoodsSpu({ tag, spu: draft });
    });
    log.info(tag, 'createGoodsSpu success!', draft);
  } catch (error) {
    log.info(tag, 'createGoodsSpu error!', error);
    throw error;
  }
}
