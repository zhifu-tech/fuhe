import log from '@/common/log/log';

export default async function ({ tag, skuIdList }) {
  try {
    let pageNumber = 0;
    let results = [];
    let totals = 0;
    do {
      ++pageNumber;
      const {
        data: { records, total },
      } = await wx.cloud.models.fh_stock.list({
        select: {
          _id: true,
          code: true,
          skuId: true,
          costPrice: true,
          originalPrice: true,
          salePrice: true,
          quantity: true,
          createdAt: true,
          updatedAt: true,
        },
        filter: {
          where: {
            $and: [{ skuId: { $in: skuIdList } }],
          },
        },
        orderBy: [{ skuId: 'asc' }, { createdAt: 'asc' }, { costPrice: 'asc' }],
        getCount: true,
        pageSize: 200,
        pageNumber,
      });
      totals = total;
      results = [...results, ...records];
    } while (results.length < totals);
    log.info(tag, 'stock-list-batch', totals === results.length);

    return { records: results, total: results.length };
  } catch (error) {
    log.error(tag, 'stock-list-batch', error);
    throw error;
  }
}
