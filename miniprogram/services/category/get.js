import log from '../../common/log/log';
import cache from './cache';

export default async function ({ tag, saasId, id, loadFromCacheEnabled = true }) {
  if (loadFromCacheEnabled) {
    const cached = cache.getCategory(saasId, id);
    if (cached) {
      log.info(tag, 'category-get', 'hit cached', cached);
      return cached;
    }
  }
  try {
    const { data } = await wx.cloud.models.fh_category.get({
      data: {
        _id: true,
        saasId: true,
        title: true,
      },
      filter: {
        where: {
          _id: { $eq: id },
        },
      },
    });
    log.info(tag, 'category-get', 'load from cloud', data);
    cache.setCategory(saasId, id, data);
    return data;
  } catch (error) {
    log.error(tag, 'category-get', error);
    throw error;
  }
}
