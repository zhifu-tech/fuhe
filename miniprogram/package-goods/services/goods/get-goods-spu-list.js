import log from '@/common/log/log';
import { flow } from 'mobx-miniprogram';
import goodsStore from '../../stores/goods/index';
import goodsService from '../../services/goods/index';

export default async function getGoodsSpuList({
  tag, //
  trigger,
  idList,
  callback,
}) {
  callback({ code: 'loading', trigger });
  log.info(tag, trigger, 'getGoodsSpuList', idList.length);

  const spuList = [];
  const unstored = [];
  // 过滤本地没有的商品列表
  idList.forEach((id, index) => {
    const spu = goodsStore.getSpu(id);
    if (spu) {
      spuList[index] = spu;
    } else {
      unstored.push({ id, index });
      log.info(tag, 'getGoodsSpuList', id, 'not found');
    }
  });
  if (unstored.length > 0) {
    const unstoredSpuList = await goodsService.fetchGoodsSpuListAsync({
      tag,
      trigger,
      idList: unstored.map((item) => item.id),
    });
    unstoredSpuList.forEach((spu, index) => {
      spuList[unstored[index].index] = spu;
    });
    log.info(tag, 'getGoodsSpuList', unstoredSpuList.length);
  }
  callback({ code: 'success', trigger });
  log.info(tag, trigger, 'getGoodsSpuList', spuList.length);
  return spuList;
}
