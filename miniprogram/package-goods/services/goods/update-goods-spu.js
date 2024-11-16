import log from '@/common/log/log';
import goodsModel from '../../models/goods/index';
import goodsStore from '../../stores/goods/index';

export default async function updateGoodsSpu({ tag, spu, title, desc }) {
  try {
    const fileds = {};
    if (title != null) fileds.title = title;
    if (desc != null) fileds.desc = desc;

    await goodsModel.spuUpdate({
      tag,
      spuId: spu._id,
      ...fileds,
    });

    goodsStore.spu.updateSpuInfo({ spu, ...fileds });
    log.info(tag, 'update spu success');
  } catch (error) {
    log.error(tag, 'update spu error', error);
    throw error;
  }
}
