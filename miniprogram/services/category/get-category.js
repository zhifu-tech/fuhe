import log from '@/common/log/log';
import store from '@/stores/store';
import model from '@/models/index';

export default async function ({ tag, cId }) {
  const category = store.category.getCategory(cId);
  if (category) {
    log.info(tag, 'category-get', 'load from store', category);
    return category;
  }
  try {
    const data = await model.category.get({ tag, _id: cId });
    store.category.setCategory(data);
    log.info(tag, 'category-get', 'load from server', data);
    return data;
  } catch (error) {
    log.error(tag, 'category-get', error);
    throw error;
  }
}
