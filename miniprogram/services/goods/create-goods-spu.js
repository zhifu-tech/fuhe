import log from '@/common/log/log';
import { saasId } from '@/common/saas/saas';
import models from '@/models/index';

export default async function ({ tag, spu }) {
  try {
    const id = await models.goods.spuCreate({
      tag,
      saasId: saasId(),
      cId: spu.cId,
      title: spu.title,
      desc: spu.desc || '',
    });
    spu._id = id;
    log.info(tag, 'createGoodsSpu success!', spu);
  } catch (error) {
    log.info(tag, 'createGoodsSpu error!', error);
    throw error;
  }
}
