import log from '@/common/log/log';
import cartStore from '../../stores/index';
import cartModels from '../../models/index';

export default async function getCardRecord({ tag, _id, useStore = true }) {
  // 如果 useStore 为 true，则从store中获取数据
  if (useStore) {
    const data = cartStore.getCartRecord({ tag, _id });
    if (data) {
      log.info(tag, 'getCardRecord', 'get from store', data);
      return data;
    }
  }

  try {
    const data = await cartModels.get({ _id });
    // 将拉取的数据保存到store中
    cartStore.addCartRecord({ tag, record: data });
    log.info(tag, 'getCardRecord', 'get from cloud');
    return data;
  } catch (error) {
    log.info(tag, 'getCardRecord', 'error', error);
    throw error;
  }
}
