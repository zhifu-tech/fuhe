import log from '@/common/log/log';
import stores from '@/stores/index';
import goodsModel from '../../models/goods/index';

export default async function getGoodsInfo({ tag, _id }) {
  try {
    const { data } = await goodsModel.getSpu({ tag, _id });
    stores.goods.addGoodsSpu({ tag, spu: data });
    log.info(tag, 'getGoodsInfo', data);
    return data;
  } catch (error) {
    log.error(tag, 'getGoodsInfo', error);
    throw error;
  }
}
