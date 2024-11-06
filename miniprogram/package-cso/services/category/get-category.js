import log from '@/common/log/log';
import categoryModel from '../../models/category/index';
import categroyStore from '../../stores/category/index';

export default async function ({ tag, cId, useStore = true }) {
  if (useStore) {
    const category = categroyStore.getCategory(cId);
    if (category) {
      log.info(tag, 'category-get', category.title, 'load from store');
      return category;
    }
  }
  try {
    const data = await categoryModel.get({ tag, _id: cId });
    categroyStore.setCategory(data);
    log.info(tag, 'category-get', data.title, 'load from server');
    return data;
  } catch (error) {
    log.error(tag, 'category-get', data.title, error);
    throw error;
  }
}
