import log from '@/common/log/log';
import stores from '@/stores/index';
import models from '@/models/index';

export default async function ({ tag, spu, title, desc }) {
  try {
    await models.goods.spuUpdate({
      tag,
      spuId: spu._id,
      title,
      desc,
    });
    stores.goods.updateGoodsSpu({ tag, spu });
    log.info(tag, 'update spu success');
  } catch (error) {
    log.error(tag, 'update spu error', error);
    throw error;
  }
}
