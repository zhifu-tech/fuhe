import log from '@/common/log/log';
import cartStore from '../../stores/cart/index';
import cartModels from '../../models/cart/index';
import { saasId } from '@/common/saas/saas';
import { flow } from 'mobx-miniprogram';

export default function fetchCartData({ tag, trigger, callback }) {
  let _task = _fetchCartData({
    tag,
    trigger,
    callback,
    _finally: () => {
      _task = null;
    },
  });
  return {
    key: 'fetchCartData',
    dispose: () => {
      _task?.cancel();
      _task = null;
    },
  };
}

const _fetchCartData = flow(function* ({ tag, trigger, callback, _finally }) {
  // 请求中，切换选中状态
  callback({ code: 'loading', trigger });
  log.info(tag, 'fetch-cart-data', trigger);

  try {
    const data = yield cartModels.all({
      tag,
      saasId: saasId(),
    });

    // 保存结果到 store 中
    cartStore.setFetchCartData({ tag, ...data });

    callback({ code: 'success', trigger });
    log.info(tag, 'fetch-cart-data', trigger, data);
  } catch (error) {
    // 判断任务是否被取消
    if (error.message === 'TASK_CANCELLED') {
      callback({ code: 'cancelled', trigger });
      log.info(tag, 'fetchCartGoods was cancelled');
    } else {
      // 请求失败，切换选中状态
      callback({ code: 'error', error, trigger });
      log.error(tag, 'fetchCartGoods error', error);
    }
  } finally {
    _finally?.();
  }
});
