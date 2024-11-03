import log from '@/common/log/log';
import { saasId } from '@/common/saas/saas';
import stores from '@/stores/index';
import models from '@/models/index';
import { flow } from 'mobx-miniprogram';

let _fetchCategoryListTask = null; // 记录当前正在进行的请求

export default async function ({ tag, trigger }) {
  log.info(tag, 'fetchCategoryList', trigger);
  if (_fetchCategoryListTask) {
    _fetchCategoryListTask.cancel();
  }

  _fetchCategoryListTask = _fetchCategoryList({ tag, trigger });
  return _fetchCategoryListTask;
}

const _fetchCategoryList = flow(function* ({ tag, trigger }) {
  try {
    // 请求中，切换选中状态
    stores.category.setFetchCategoryListStatus({ code: 'loading', trigger });

    const { records: categoryList, total } = yield models.category.all({
      tag,
      saasId: saasId(),
    });

    // 保存请求结果
    stores.category.setFetchCategoryListResult({ categoryList, total });

    // 请求成功，切换选中状态
    stores.category.setFetchCategoryListStatus({ code: 'success', trigger });
    log.info(tag, '_fetchCategoryList result', categoryList);
  } catch (error) {
    // 判断任务是否被取消
    if (error.message === 'FLOW_CANCELLED') {
      log.info(tag, '_fetchCategoryList was cancelled');
    } else {
      // 请求失败，切换选中状态
      stores.category.setFetchCategoryListStatus({ code: 'error', trigger });
      log.error(tag, '_fetchCategoryList error', error);
    }
    throw error;
  } finally {
    _fetchCategoryListTask = null;
  }
});

function _postCategoryList(list) {
  const pinyin = require('js-pinyin');
  pinyin.setOptions({ checkPolyphone: false, charCase: 0 });
  list.forEach((item) => {
    item.camel = pinyin.getCamelChars(item.title);
  });
  list.sort(({ camel: a }, { camel: b }) => {
    if (a > b) return 1;
    else if (a < b) return -1;
    else return 0;
  });
}
