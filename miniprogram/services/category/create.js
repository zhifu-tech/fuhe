import log from '@/common/log/log';
import services from '../index';
import cache from './cache';

export default async function ({ tag, saasId, title }) {
  try {
    const { data } = await wx.cloud.models.fh_category.create({
      data: {
        saasId,
        title,
        disabled: 0,
      },
    });
    const category = services.category.createCategory({
      id: data.id,
      saasId,
      title,
      disabled: 0,
    });
    cache.setCategory(saasId, category._id, category);
    log.info(tag, 'category-create', category);
    return category;
  } catch (error) {
    log.error(tag, 'category-create', error);
    throw error;
  }
}
