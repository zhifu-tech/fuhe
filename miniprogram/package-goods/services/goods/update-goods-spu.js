import log from '@/common/log/log';
import goodsModel from '../../models/goods/index';
import goodsStore from '../../stores/goods/index';

export default async function ({ tag, spu, title, desc }) {
  try {
    await goodsModel.spuUpdate({
      tag,
      spuId: spu._id,
      title,
      desc,
    });
    goodsStore.updateGoodsSpu({ tag, spu });
    log.info(tag, 'update spu success');
  } catch (error) {
    log.error(tag, 'update spu error', error);
    throw error;
  }
}
