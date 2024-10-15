import log from '../../common/log/log';

export default async function ({ tag, skuId, imageList }) {
  try {
    const { data } = await wx.cloud.models.fh_goods_sku.update({
      data: {
        imageList,
      },
      filter: {
        where: {
          $and: [
            {
              _id: {
                $eq: skuId,
              },
            },
          ],
        },
      },
    });
    log.info(tag, 'goods-sku-update', data);
    return data;
  } catch (error) {
    log.error(tag, 'goods-sku-create', error);
    throw error;
  }
}
