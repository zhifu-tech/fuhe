import log from '@/common/log/log';
import categoryModel from '../../models/category/index';
import categroyStore from '../../stores/category/index';

export default async function ({ tag, category }) {
  try {
    await categoryModel.delete({
      tag,
      _id: category._id,
      title: category.title,
    });

    categroyStore.deleteCategory(category);
    log.info(tag, 'category-delete', category.title);
    return category;
  } catch (error) {
    log.error(tag, 'category-delete', category.title, error);
    throw error;
  }
}
