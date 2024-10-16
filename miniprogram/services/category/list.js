import log from '../../common/log/log';
import cache from './cache';

export default async function ({ tag, saasId, pageNumber, loadFromCacheEnabled = true }) {
  if (loadFromCacheEnabled) {
    const cached = cache.getList(saasId, pageNumber);
    if (cached) {
      log.info(tag, 'category-list', 'hit cached');
      return cached;
    }
  }
  try {
    const { data } = await wx.cloud.models.fh_category.list({
      select: {
        _id: true,
        saasId: true,
        title: true,
      },
      filter: {
        where: {
          $and: [
            {
              disabled: { $eq: 0 },
            },
            {
              saasId: { $eq: saasId },
            },
          ],
        },
      },
      getCount: true,
      pageNumber,
      pageSize: 200,
    });
    // 保存结果到缓存中
    cache.setList({ saasId, data });
    log.info(tag, 'category-list', 'load from cloud', data);
    return data;
  } catch (e) {
    log.error(tag, 'category-list', e);
    throw e;
  }
}
