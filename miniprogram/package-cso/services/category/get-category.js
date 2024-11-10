import log from '@/common/log/log';
import categoryModel from '../../models/category/index';
import categroyStore from '../../stores/category/index';
import setCategoryPinyin from './set-category-pinyin.js';

export default async function ({ tag, cId, useStore = true }) {
  if (useStore) {
    const category = categroyStore.getCategory(cId);
    if (category) {
      log.info(tag, 'category-get', category.title, 'load from store');
      return category;
    }
  }
  try {
    const category = await categoryModel.get({ tag, _id: cId });
    // 增加pinyin支持
    setCategoryPinyin([category]);

    categroyStore.setCategory({ tag, category });
    log.info(tag, 'category-get', category.title, 'load from server');
    return category;
  } catch (error) {
    log.error(tag, 'category-get', error);
    throw error;
  }
}
