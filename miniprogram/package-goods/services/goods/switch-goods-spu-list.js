import log from '@/common/log/log';
import goodsStore from '../../stores/goods/index';

export default function ({ tag, cId }) {
  log.info(tag, 'switchGoodsSpuList', cId);
  goodsStore.selected = cId;
}

export function checkNeedFetchedData({ tag, cId }) {
  return goodsStore.checkNeedFetchedData({ tag, cId });
}
