import log from '../../common/log/log';
import cache from './cache';

export async function list({ tag, saasId, pageNumber, loadFromCacheEnabled = true }) {
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

export async function all({ tag, saasId, loadFromCacheEnabled = true }) {
  try {
    let pageNumber = 0;
    let results = [];
    let totals = 0;
    do {
      ++pageNumber;
      const { records, total } = await list({ tag, saasId, pageNumber, loadFromCacheEnabled });
      totals = total;
      results = [...results, ...records];
    } while (results.length < totals);

    _postCategoryList(results);
    log.info(tag, 'category-all', totals, results);
    return { records: results, total: results.length };
  } catch (error) {
    log.error(tag, 'entity-all', error);
    throw error;
  }
}

function _postCategoryList(list) {
  const pinyin = require('js-pinyin');
  pinyin.setOptions({ checkPolyphone: false, charCase: 0 });
  list.forEach((item) => {
    item.camel = pinyin.getCamelChars(item.title);
  });
  list.sort(({ camel: a }, { camel: b }) => {
    if (a > b) return 1;
    else if (a < b) return -1;
    else return 0;
  });
}
