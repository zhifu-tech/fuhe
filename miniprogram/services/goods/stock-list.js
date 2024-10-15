import log from '../../common/log/log';
import services from '../index';

export default async function list({ tag, skuId }) {
  try {
    const { data } = await wx.cloud.models.fh_stock.list({
      select: {
        _id: true,
        skuId: true,
        costPrice: true,
        salePrice: true,
        quantity: true,
        createdAt: true, // 2024-10-12 08:17:42
        updatedAt: true, // 2024-10-12 08:17:42
      },
      filter: {
        where: {
          $and: [
            { skuId: { $eq: skuId } },
            { quantity: { $gt: 0 } }, // 忽略已经清空的
          ],
        },
      },
      orderBy: [
        { createdAt: 'asc' }, // 创建时间升序排列
        { costPrice: 'asc' }, // 成本升序排序
      ],
      getCount: true,
      pageNumber: 1,
      pageSize: 200,
    });
    log.info(tag, 'stock-list', data);
    return data;
  } catch (error) {
    log.error(tag, 'stock-list', error);
    throw error;
  }
}
