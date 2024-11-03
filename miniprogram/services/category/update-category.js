import log from '@/common/log/log';
import stores from '@/stores/index';
import models from '@/models/index';
export default async function ({ tag, category }) {
  try {
    await models.category.update({
      tag,
      _id: category._id,
      title: category.title,
    });
    stores.category.updateCategory({ tag, category });
    log.info(tag, 'category-update', category);
    return category;
  } catch (error) {
    log.error(tag, 'category-update', error);
    throw error;
  }
}
