import { toCategoryItems } from '../../pages/store/data/storeCategory';
import log from '../../utils/log';
import queryCategory from '../db/queryCategory';

/** 获取仓储信息 */
export default async function (storeCategory) {
  try {
    const data = await queryCategory().then(({ records, total }) => {
      const data = {
        items: toCategoryItems(records),
        total: total,
        pageNumber: 1,
        categories: records,
      };
      data.selected = data.items[0].value;
      storeCategory.setCategoryData(data);
      return data;
    });
    log.info('fetchStore', data);
    return data;
  } catch (e) {
    log.error(tag, e);
    return {};
  }
}
