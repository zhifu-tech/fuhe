import log from '@/common/log/log';
import categoryModel from '../../models/category/index';
import categoryService from './index';

export default async function ({ tag, draft }) {
  try {
    const id = await categoryModel.create({
      tag,
      title: draft.title,
    });
    draft._id = id;

    // 新建分类，需要重新获取分类数据
    const newCategory = await categoryService.getCategory({
      tag,
      cId: id,
      useStore: false,
    });
    log.info(tag, 'category-create', draft.title);
    return newCategory;
  } catch (error) {
    log.error(tag, 'category-create', draft.title, error);
    throw error;
  }
}
