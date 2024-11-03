import log from '@/common/log/log';
import stores from '@/stores/index';
import models from '@/models/index';

export default async function ({ tag, category }) {
  try {
    await models.category.deleteCategory({
      tag,
      _id: category._id,
    });
    log.info(tag, 'category-delete', category);
    stores.category.deleteCategory(category);
    return category;
  } catch (error) {
    log.error(tag, 'category-delete', error);
    throw error;
  }
}
