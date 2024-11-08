import log from '@/common/log/log';
import cartStore from '../../stores/cart/index';
import cartModels from '../../models/cart/index';
import { flow } from 'mobx-miniprogram';
import { saasId } from '@/common/saas/saas';

let _task = null;
export default async function fetchCartData({ tag, trigger, callback = () => null }) {
  log.info(tag, 'fetch-cart-data', trigger);
  if (_task) {
    _task.cancel();
  }
  _task = _fetchCartData({ tag, trigger, callback });
  return {
    dispose: () => {
      _task?.cancel();
      _task = null;
    },
  };
}

const _fetchCartData = flow(function* ({ tag, trigger, callback }) {
  // 请求中，切换选中状态
  callback({ code: 'loading', trigger });

  try {
    const data = yield cartModels.all({
      saasId: saasId(),
    });

    // 保存结果到 store 中
    cartStore.setFetchCartData({ tag, ...data });

    callback({ code: 'success', trigger });

    log.info(tag, 'fetch-cart-data', trigger, data);
  } catch (error) {
    // 判断任务是否被取消
    if (error.message === 'FLOW_CANCELLED') {
      callback({ code: 'cancelled', trigger });
      log.info(tag, 'fetchCartGoods was cancelled');
    } else {
      // 请求失败，切换选中状态
      callback({ code: 'error', error, trigger });
      log.error(tag, 'fetchCartGoods error', error);
    }
  } finally {
    // 重置任务状态
    _task = null;
  }
});
