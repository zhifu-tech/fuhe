import log from '@/common/log/log';

export default async function ({ tag }) {
  try {
    const { data } = await wx.cloud.models.fh_entity.list({
      select: {
        _id: true,
        name: true,
        signature: true,
        tel: true,
        type: true,
        contacts: true,
        contacts2: true,
      },
      filter: {
        where: {},
      },
      pageSize: 200,
      pageNumber: 1,
      getCount: true,
    });
    log.info(tag, 'entity-list', data);
  } catch (e) {
    log.error(tag, 'entity-list', e);
    throw e;
  }
}

export async function all({ tag }) {
  try {
    let pageNumber = 0;
    let results = [];
    let totals = 0;
    do {
      ++pageNumber;
      const {
        data: { records, total },
      } = await wx.cloud.models.fh_entity.list({
        select: {
          _id: true,
          name: true,
          signature: true,
          tel: true,
          type: true,
          contacts: true,
          contacts2: true,
        },
        filter: {
          where: {},
        },
        getCount: true,
        pageSize: 200,
        pageNumber,
      });
      totals = total;
      results = [...results, ...records];
    } while (results.length < totals);

    _postEntityList(results);
    log.info(tag, 'entity-batch', totals, results);
    return { records: results, total: results.length };
  } catch (error) {
    log.error(tag, 'entity-all', error);
    throw error;
  }
}

function _postEntityList(list) {
  const pinyin = require('js-pinyin');
  pinyin.setOptions({ checkPolyphone: false, charCase: 0 });
  list.forEach((item) => {
    item.camel = pinyin.getCamelChars(item.name);
  });
  list.sort(({ camel: a }, { camel: b }) => {
    if (a > b) return 1;
    else if (a < b) return -1;
    else return 0;
  });
}
