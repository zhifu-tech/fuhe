import log from '../../common/log/log';

function paramToData({ imageList, optionIdList, spuId }) {
  return {
    imageList,
    optionIdList,
    spuId,
    spu: {
      _id: spuId,
    },
  };
}

export async function create({ tag, param }) {
  try {
    const { data } = await wx.cloud.models.fh_goods_sku.create({
      data: paramToData(param),
    });
    log.info(tag, 'goods-sku-create', data);
    return data;
  } catch (error) {
    log.error(tag, 'goods-sku-create', error);
    throw error;
  }
}

export async function createMany({ tag, paramList }) {
  if (paramList.length === 1) {
    log.info(tag, 'goods-sku-createMany', 'use create instead');
    const res = await create({
      tag,
      param: paramList[0],
    });
    return [res];
  }
  try {
    const { data } = await wx.cloud.fh_goods_sku.createMany({
      data: paramList.map(paramToData),
    });
    log.info(tag, 'goods-sku-createMany', data);
    return data;
  } catch (error) {
    log.error(tag, 'goods-sku-create', error);
    throw error;
  }
}
