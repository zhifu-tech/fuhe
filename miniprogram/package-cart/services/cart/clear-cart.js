import log from '@/common/log/log';
import cartStore from '../../stores/cart/index';
import cartModels from '../../models/cart/index';
import { flow } from 'mobx-miniprogram';

export default flow(function* clearCart({ tag }) {
  try {
    // 清空购物车，删除所有记录
    const data = yield cartModels.deleteMany({
      tag,
      idList: cartStore.dataList.map((r) => r._id),
    });
    // 从store中删除记录
    cartStore.dataList.clear();

    log.info(tag, 'clearCart', data);
    return data;
  } catch (error) {
    log.info(tag, 'clearCart', error);
    throw error;
  }
});
