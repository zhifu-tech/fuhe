import log from '../../common/log/log';

function paramToData({ quantity, costPrice, originalPrice, skuId, location = 'default' }) {
  return {
    location,
    quantity,
    costPrice,
    originalPrice,
    salePrice: originalPrice, // 商品初始的售价为原价
    skuId,
    sku: {
      _id: skuId,
    },
  };
}

export async function create({ tag, param }) {
  try {
    const { data } = await wx.cloud.models.fh_stock.create({
      data: paramToData(param),
    });
    log.info(tag, 'stock-create', data);
    return data;
  } catch (error) {
    log.error(tag, 'stock-create', error);
    throw error;
  }
}

export async function createMany({ tag, paramList }) {
  if (paramList.length === 1) {
    log.info(tag, 'stock-createMany', 'use create instead');
    const res = await create({
      tag,
      param: paramList[0],
    });
    return [res];
  }
  try {
    const { data } = await wx.cloud.fh_stock.createMany({
      data: paramList.map(paramToData),
    });
    log.info(tag, 'stock-createMany', data);
    return data;
  } catch (error) {
    log.error(tag, 'stock-create', error);
    throw error;
  }
}
