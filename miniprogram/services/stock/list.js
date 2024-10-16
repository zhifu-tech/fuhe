import log from '../../common/log/log';

export default async function ({ tag, skuId }) {
  try {
    const { data } = await wx.cloud.models.fh_stock.list({
      select: {
        _id: true,
        skuId: true,
        costPrice: true,
        salePrice: true,
        quantity: true,
        createdAt: true,
        updatedAt: true,
      },
      filter: {
        where: {
          $and: [{ skuId: { $eq: skuId } }, { quantity: { $gt: 0 } }],
        },
      },
      orderBy: [{ createdAt: 'asc' }, { costPrice: 'asc' }],
      getCount: true,
      pageNumber: 1,
      pageSize: 200,
    });
    log.info(tag, 'stock-list', data);
    return data;
  } catch (error) {
    log.error(tag, 'stock-list', error);
    throw error;
  }
}
