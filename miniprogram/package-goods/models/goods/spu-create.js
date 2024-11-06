import log from '@/common/log/log';

export default async function ({ tag, saasId, cId, title, desc }) {
  try {
    const { data } = await wx.cloud.models.fh_goods_spu.create({
      data: {
        saasId,
        title,
        desc,
        cId,
        category: {
          _id: cId,
        },
      },
    });
    log.info(tag, 'goods-spu-create', title, data);
    return data.id;
  } catch (error) {
    log.error(tag, 'goods-spu-create', error);
    throw error;
  }
}
