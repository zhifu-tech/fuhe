import log from '@/common/log/log';
import { saasId } from '@/common/saas/saas';
import categoryModel from '../../models/category/index';
import categoryService from './index';

export default async function ({ tag, draft }) {
  try {
    const data = await categoryModel.create({
      tag,
      saasId: saasId(),
      title: draft.title,
    });
    draft._id = data.id;

    // 新建分类，需要重新获取分类数据
    const newCategory = categoryService.getCategory({
      tag,
      id: data.id,
      useStore: false,
    });
    log.info(tag, 'category-create', draft.title);
    return newCategory;
  } catch (error) {
    log.error(tag, 'category-create', draft.title, error);
    throw error;
  }
}
