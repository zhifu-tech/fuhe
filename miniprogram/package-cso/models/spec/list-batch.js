import log from '@/common/log/log';

export default async function ({ tag, cIdList }) {
  try {
    let pageNumber = 0;
    let results = [];
    let totals = 0;
    do {
      ++pageNumber;
      const {
        data: { records, total },
      } = await wx.cloud.models.fh_spec.list({
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
            $and: [{ cId: { $in: cIdList } }],
          },
        },
        orderBy: [{ cId: 'asc' }],
        getCount: true,
        pageSize: 200,
        pageNumber,
      });
      totals = total;
      results = [...results, ...records];
    } while (results.length < totals);

    // 将连续的results，按照cId进行分段，并添加到 map中
    const specListMap = new Map();
    for (let i = 0, j = 0; j < results.length; i = j) {
      const cId = results[i].cId;
      while (j < results.length && results[j].cId === cId) j++;
      specListMap.set(cId, results.slice(i, j));
    }
    log.info(tag, 'spec-list-batch', totals, specListMap.size);
    return specListMap;
  } catch (error) {
    log.error(tag, 'spec-list-batch', error);
    throw error;
  }
}
