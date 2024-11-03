import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';

export default function ({ tag, cId, trigger }) {
  log.info(tag, 'switchGoodsSpuList', trigger, cId);
  const needFetch = stores.goods.setSelectedCategory({ tag, cId, trigger });
  if (needFetch) {
    log.info(tag, 'switchGoodsSpuList needFetch');
    services.goods.fetchGoodsSpuList({ tag, cId, trigger, pageNumber: 1 });
  }
}
