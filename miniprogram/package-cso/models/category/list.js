import log from '@/common/log/log';

export default async function list({ tag, saasId, pageNumber }) {
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
    log.info(tag, 'category-list', data);
    return data;
  } catch (error) {
    log.error(tag, 'category-list', error);
    throw error;
  }
}

export async function all({ tag, saasId }) {
  let pageNumber = 0;
  let results = [];
  let totals = 0;
  do {
    ++pageNumber;
    const { records, total } = await list({ tag, saasId, pageNumber });
    totals = total;
    results = [...results, ...records];
  } while (results.length < totals);

  log.info(tag, 'category-all', totals, results.length);
  return {
    records: results,
    total: results.length,
  };
}
