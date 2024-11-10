import log from '@/common/log/log';
import { saasId } from '@/common/saas/saas';
import { flow } from 'mobx-miniprogram';
import categoryModel from '../../models/category/index';
import categroyStore from '../../stores/category/index';
import setCategoryPinyin from './set-category-pinyin.js';

let _task = null; // 记录当前正在进行的请求

export default async function ({ tag, trigger, callback = () => null }) {
  log.info(tag, 'fetchCategoryList', trigger);
  if (_task) {
    _task.cancel();
  }

  _task = _fetchCategoryList({ tag, trigger, callback });
  return {
    dispose: () => {
      _task?.cancel();
      _task = null;
    },
  };
}

const _fetchCategoryList = flow(function* ({ tag, trigger, callback }) {
  try {
    // 请求中，切换选中状态
    callback({ code: 'loading', trigger });

    const { records: categoryList, total } = yield categoryModel.all({
      tag,
      saasId: saasId(),
    });

    // 增加pinyin支持
    setCategoryPinyin(categoryList);

    // 保存请求结果
    categroyStore.setCategoryList({ categoryList, total });

    // 请求成功，切换选中状态
    callback({ code: 'success', trigger, categoryList });
    log.info(tag, '_fetchCategoryList result', categoryList.length);
  } catch (error) {
    if (error.message === 'FLOW_CANCELLED') {
      // 判断任务是否被取消
      callback({ code: 'cancel', trigger });
      log.info(tag, '_fetchCategoryList was cancelled');
    } else {
      // 请求失败，切换选中状态
      callback({ code: 'error', trigger });
      log.error(tag, '_fetchCategoryList error', error);
    }
    throw error;
  } finally {
    _task = null;
  }
});
