import { emptySpecData, isAllCategory } from '../../pages/store/data/storeCategory';
import { toSpecItems } from '../../pages/store/data/storeSpec';
import log from '../../utils/log';
import querySpec from '../db/querySpec';

export default async function (storeCategory, storeSpec, categoryId) {
  // 1. 有上次的记录，直接展示上次记录
  const last = storeSpec.getSpecData(categoryId);
  if (last != null) {
    log.info('fetchStoreSpecData', 'hit last cache!');
    return last;
  }
  // 2. 如果是全部分类，则请求所有规格信息
  const isCategoryAll = isAllCategory(categoryId);
  if (isCategoryAll) {
    try {
      const { records, total } = await querySpec();
      storeSpec.setSpecListToCache(records);
      const data = {
        items: toSpecItems(records),
        total: total,
        pageNumber: 1,
        specs: records,
      };
      data.selected = data.items[0].value;
      storeSpec.setSpecData(categoryId, data);
      return data;
    } catch (e) {
      log.error(tag, e);
      return emptySpecData();
    }
  }
  // 3. 从分类中加载规格信息
  const category = storeCategory.getCategory(categoryId);
  if (category === null || category.category_spec === null) {
    log.info(`Unknown category ${categoryId}`);
    return emptySpecData();
  }
  const csIds = category.category_spec?.map(({ _id }) => _id) || [];
  if (csIds.length <= 0) {
    log.info('fetchStoreSpecData', 'no spec');
    return emptySpecData();
  }
  const { cached, noCached } = storeSpec.getSpecListFromCache(csIds, true);
  log.info(
    'fetchStoreSpecData',
    `This category has ${csIds.length} spec`,
    `and ${cached.length} cached, and ${noCached.length} not cached!`,
  );
  let specs = null;
  if (noCached.length > 0) {
    const { records } = await querySpec({ csIds: noCached });
    storeSpec.setSpecListToCache(records);
    const { cached: newCached } = storeSpec.getSpecListFromCache(csIds);
    specs = newCached;
  } else {
    specs = cached;
  }
  const data = {
    items: toSpecItems(specs),
    total: csIds.length,
    pageNumber: 1,
  };
  data.selected = data.items[0].value;
  storeSpec.setSpecData(categoryId, data);
  return data;
}
