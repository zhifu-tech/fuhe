import log from '@/common/log/log';
import stores from '@/stores/index';
import models from '@/models/index';

export default async function ({ tag, cId }) {
  const category = stores.category.getCategory(cId);
  if (category) {
    log.info(tag, 'category-get', 'load from store', category);
    return category;
  }
  try {
    const data = await models.category.get({ tag, _id: cId });
    stores.category.setCategory(data);
    log.info(tag, 'category-get', 'load from server', data);
    return data;
  } catch (error) {
    log.error(tag, 'category-get', error);
    throw error;
  }
}
