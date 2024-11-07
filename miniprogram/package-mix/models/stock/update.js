import log from '@/common/log/log';

export default async function ({ tag, _id, quantity, costPrice, originalPrice, salePrice }) {
  try {
    const pData = {};
    if (quantity) pData.quantity = quantity;
    if (costPrice) pData.costPrice = costPrice;
    if (salePrice) pData.salePrice = salePrice;
    if (originalPrice) pData.originalPrice = originalPrice;
    const { data } = await wx.cloud.models.fh_stock.update({
      data: pData,
      filter: {
        where: {
          $and: [
            {
              _id: {
                $eq: _id,
              },
            },
          ],
        },
      },
    });
    log.info(tag, 'goods-stock-update', data);
    return data;
  } catch (error) {
    log.error(tag, 'goods-stock-create', error);
    throw error;
  }
}
