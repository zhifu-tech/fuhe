import log from '@/common/log/log';

export default async function ({ tag, _id }) {
  try {
    const { data } = await wx.cloud.models.fh_stock.get({
      select: {
        _id: true,
        code: true,
        skuId: true,
        costPrice: true,
        salePrice: true,
        originalPrice: true,
        quantity: true,
        createdAt: true,
        updatedAt: true,
      },
      filter: {
        where: {
          $and: [{ _id: { $eq: _id } }],
        },
      },
    });
    log.info(tag, 'stock-get', data);
    return data;
  } catch (error) {
    log.error(tag, 'stock-get', error);
    throw error;
  }
}
