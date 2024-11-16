import log from '@/common/log/log';
import stockStore from '../../stores/stock/index';
import stockModel from '../../models/stock/index';

export default async function updateStockInfo({
  tag,
  stock,
  quantity,
  costPrice,
  originalPrice,
  salePrice,
}) {
  const fields = {};
  if (quantity != null) {
    fields.quantity = quantity;
  }
  if (costPrice != null) {
    fields.costPrice = costPrice;
  }
  if (originalPrice != null) {
    fields.originalPrice = originalPrice;
  }
  if (salePrice != null) {
    fields.salePrice = salePrice;
  }
  // 如果没有传入任何字段，则直接返回
  if (Object.keys(fields).length === 0) {
    log.info(tag, 'updateStockInfo', 'no updated fields');
    return {};
  }
  try {
    const data = await stockModel.update({
      tag,
      _id: stock._id,
      ...fields,
    });

    // 更新stock记录
    stockStore.updateStockInfo({
      tag,
      stock,
      ...fields,
    });

    log.info(tag, 'updateStockInfo', data);
    return data;
  } catch (error) {
    log.error(tag, 'updateStockInfo', error);
    throw error;
  }
}

export async function updateStockInfoList({ tag, infoList }) {
  log.info(tag, 'updateStockInfoList', infoList.length);
  return Promise.all(
    infoList.map((info) => {
      return updateStockInfo({ tag, ...info });
    }),
  );
}
