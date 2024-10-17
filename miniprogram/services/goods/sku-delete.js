import log from '../../common/log/log';

export default async function ({ tag, id }) {
  try {
    const { data } = await wx.cloud.models.fh_goods_sku.delete({
      filter: {
        where: {
          $and: [
            {
              _id: {
                $eq: id,
              },
            },
          ],
        },
      },
    });
    log.info(tag, 'goods-sku-delete', data);
    return data;
  } catch (error) {
    log.error(tag, 'goods-sku-delete', error);
    throw error;
  }
}
