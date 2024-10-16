import cache from './cache';
import log from '../../common/log/log';

export default async function ({ tag, cId, loadFromCacheEnabled = true }) {
  if (loadFromCacheEnabled) {
    const cached = cache.getList(cId);
    if (cached) {
      log.info(tag, 'spec-list', 'hit cached', cached);
      return cached;
    }
  }
  try {
    const { data } = await wx.cloud.models.fh_spec.list({
      select: {
        _id: true,
        cId: true,
        title: true,
        optionList: {
          _id: true,
          sId: true,
          title: true,
        },
      },
      filter: {
        where: {
          cId: { $eq: cId },
        },
      },
      getCount: true,
      pageNumber: 1,
      pageSize: 200,
    });
    cache.setList(cId, data);
    log.info(tag, 'spec-list', data);
    return data;
  } catch (error) {
    log.error(tag, 'spec-list', error);
    throw error;
  }
}
