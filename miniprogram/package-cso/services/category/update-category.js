import log from '@/common/log/log';
import categoryModel from '../../models/category/index';
import categoryStore from '../../stores/category/index';

export default async function ({ tag, category }) {
  try {
    await categoryModel.update({
      tag,
      _id: category._id,
      title: category.title,
    });

    categoryStore.updateCategory({ tag, category });
    log.info(tag, 'category-update', category);
    return category;
  } catch (error) {
    log.error(tag, 'category-update', error);
    throw error;
  }
}
