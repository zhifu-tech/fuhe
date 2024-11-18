import log from '@/common/log/log';
import cartStore from '../../stores/cart/index';
import cartModels from '../../models/cart/index';

export default async function getCartRecord({ tag, _id, useStore = true }) {
  // 如果 useStore 为 true，则从store中获取数据
  if (useStore) {
    const data = cartStore.getCartRecord({ tag, _id });
    if (data) {
      log.info(tag, 'getCartRecord', 'get from store', data);
      return data;
    }
  }

  try {
    const data = await cartModels.get({ _id });
    // 将拉取的数据保存到store中
    log.info(tag, 'getCartRecord', 'get from cloud');
    cartStore.addCartRecord({ tag, record: data });
    return data;
  } catch (error) {
    log.info(tag, 'getCartRecord', 'error', error);
    throw error;
  }
}
