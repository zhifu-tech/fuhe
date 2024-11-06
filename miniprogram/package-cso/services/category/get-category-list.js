import log from '@/common/log/log';
import categroyStore from '../../stores/category/index';
import categroyService from './index';

export default function ({ tag, useStore = true }) {
  if (useStore) {
    const categoryList = categroyStore.categoryList();
    if (categoryList.length > 0) {
      log.info(tag, 'get-category-list', 'load from store', categoryList);
      return categoryList;
    }
  }
  try {
    const data = categroyService.fetchCategoryList({
      tag,
      trigger: 'get-category-list',
    });
    log.info(tag, 'get-category-list', 'load from server', data);
    return data;
  } catch (error) {
    log.error(tag, 'get-category-list', error);
    throw error;
  }
}
