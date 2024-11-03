import log from '../../common/log/log';

export async function updateImageList({ tag, skuId, imageList }) {
  return update({
    tag,
    skuId,
    data: {
      imageList,
    },
  });
}

export async function updateSaleInfo({ tag, skuId, salePrice }) {
  return update({
    tag,
    skuId,
    data: {
      salePrice,
    },
  });
}

async function update({ tag, skuId, data: dataParams }) {
  try {
    const { data } = await wx.cloud.models.fh_goods_sku.update({
      data: dataParams,
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
