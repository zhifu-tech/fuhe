import log from '@/common/log/log';
import cartStore from '../../stores/cart/index';
import cartModels from '../../models/cart/index';
import Disposable from '@/common/disposable/index';
import { saasId } from '@/common/saas/saas';

export default async function fetchCartData({ tag, trigger, callback = () => null }) {
  log.info(tag, 'fetch-cart-data', trigger);

  const disposable = new Disposable();
  _fetchCartData({ tag, trigger, callback, disposable });
  return disposable;
}

async function _fetchCartData({ tag, trigger, callback, disposable }) {
  // 请求中，切换选中状态
  callback({ code: 'loading', trigger });

  try {
    const data = await cartModels.all({
      saasId: saasId(),
    });

    disposable.checkDisposed();

    // 保存结果到 store 中
    cartStore.setFetchCartData({ tag, ...data });

    callback({ code: 'success', trigger });

    log.info(tag, 'fetch-cart-data', trigger, data);
  } catch (error) {
    // 判断任务是否被取消
    if (error.message === 'TASK_DISPOSABLED') {
      callback({ code: 'cancelled', trigger });
      log.info(tag, 'fetchCartGoods was cancelled');
    } else {
      // 请求失败，切换选中状态
      callback({ code: 'error', error, trigger });
      log.error(tag, 'fetchCartGoods error', error);
    }
  }
}
