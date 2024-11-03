import log from '@/common/log/log';
import { saasId } from '@/common/saas/saas';
import store from '@/stores/store';
import model from '@/models/index';

let _fetchCategoryListTask = null; // 记录当前正在进行的请求

export default async function ({ tag, trigger }) {
  log.info(tag, 'fetchCategoryList', trigger);
  if (_fetchCategoryListTask) {
    _fetchCategoryListTask.cancel();
  }

  _fetchCategoryListTask = _fetchCategoryList({ tag, trigger });
  return _fetchCategoryListTask;
}

async function _fetchCategoryList({ tag, trigger }) {
  try {
    // 请求中，切换选中状态
    store.category.setFetchCategoryListStatus({ code: 'loading', trigger });

    const { records: categoryList, total } = await model.category.all({
      tag,
      saasId: saasId(),
    });

    // 保存请求结果
    store.category.setFetchCategoryListResult({ categoryList, total });

    // 请求成功，切换选中状态
    store.category.setFetchCategoryListStatus({ code: 'success', trigger });
    log.info(tag, '_fetchCategoryList result', categoryList);
  } catch (error) {
    // 请求失败，切换选中状态
    store.category.setFetchCategoryListStatus({ code: 'error', trigger });
    log.error(tag, '_fetchCategoryList error', error);
    throw error;
  } finally {
    _fetchCategoryListTask = null;
  }
}

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
