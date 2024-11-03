import log from '@/common/log/log';
import store from '@/stores/store';
import services from '@/services/index';

export default function ({ tag }) {
  const categoryList = store.category.categoryList();
  if (categoryList.length > 0) {
    log.info(tag, 'category-list', 'load from store', categoryList);
    return categoryList;
  }
  try {
    const data = services.category.fetchCategoryList({ tag, trigger: 'category-list' });
    log.info(tag, 'category-list', 'load from server', data);
    return data;
  } catch (error) {
    log.error(tag, 'category-list', error);
    throw error;
  }
}
