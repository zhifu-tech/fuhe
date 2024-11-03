import log from '@/common/log/log';
import store from '@/stores/store';
import model from '@/models/index';
export default async function ({ tag, category }) {
  try {
    await model.category.update({
      tag,
      _id: category._id,
      title: category.title,
    });
    store.category.updateCategory({ tag, category });
    log.info(tag, 'category-update', category);
    return category;
  } catch (error) {
    log.error(tag, 'category-update', error);
    throw error;
  }
}
