import services from '../index';
import log from '../../common/log/log';
import cache from './cache';

export default async function ({ tag, saasId, id, title }) {
  try {
    const res = await wx.cloud.models.fh_category.update({
      data: {
        title,
      },
      filter: {
        where: {
          id: { $eq: id },
        },
      },
    });
    // 更新缓存中的数据
    let category = cache.getCategory(saasId, id);
    if (category) {
      category.title = title;
    } else {
      category = services.category.createCategory({ id, saasId, title, disabled: '0' });
      cache.setCategory(saasId, id, category);
    }
    log.info(tag, 'category-update', res, title);
    return res;
  } catch (error) {
    log.error(tag, 'category-update', error);
    throw error;
  }
}
