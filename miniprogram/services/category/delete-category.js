import log from '@/common/log/log';
import store from '@/stores/store';
import model from '@/models/index';

export default async function ({ tag, category }) {
  try {
    await model.category.deleteCategory({
      tag,
      _id: category._id,
    });
    log.info(tag, 'category-delete', category);
    store.category.deleteCategory(category);
    return category;
  } catch (error) {
    log.error(tag, 'category-delete', error);
    throw error;
  }
}
