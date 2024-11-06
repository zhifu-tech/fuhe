import log from '@/common/log/log';

export default async function ({ tag, spuId, title, desc }) {
  try {
    const pData = {};
    if (title) pData.title = title;
    if (desc) pData.desc = desc;
    const { data } = await wx.cloud.models.fh_goods_spu.update({
      data: pData,
      filter: {
        where: {
          $and: [
            {
              _id: {
                $eq: spuId,
              },
            },
          ],
        },
      },
    });
    log.info(tag, 'goods-spu-update', pData, data);
    return data;
  } catch (error) {
    log.error(tag, 'goods-spu-create', error);
    throw error;
  }
}
