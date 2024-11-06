import log from '@/common/log/log';
import goodsService from '../../services/goods/index';
import goodsStore from '../../stores/goods/index';

export default function ({ tag, cId, trigger }) {
  log.info(tag, 'switchGoodsSpuList', trigger, cId);
  const needFetch = goodsStore.setSelectedCategory({ tag, cId, trigger });
  if (needFetch) {
    log.info(tag, 'switchGoodsSpuList needFetch');
    goodsService.fetchGoodsSpuList({ tag, cId, trigger, pageNumber: 1 });
  }
}
