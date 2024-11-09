import log from '@/common/log/log';
import { saasId } from '@/common/saas/saas';
import goodsModel from '../../models/goods/index';
import goodsStore from '../../stores/goods/index';
import { runInAction } from 'mobx-miniprogram';

export default async function ({ tag, spu: draft }) {
  try {
    // 1. 创建spu
    const id = await goodsModel.spuCreate({
      tag,
      saasId: saasId(),
      cId: draft.cId,
      title: draft.title,
      desc: draft.desc || '',
    });

    // 2. 需要从store中删除原来的spu，然后重新添加
    runInAction(() => {
      goodsStore.deleteGoodsSpu(draft._id);
      // 更新ID,重新添加
      draft._id = id;
      goodsStore.addGoodsSpu({ tag, spu: draft });
    });
    log.info(tag, 'createGoodsSpu success!', draft);
  } catch (error) {
    log.info(tag, 'createGoodsSpu error!', error);
    throw error;
  }
}
