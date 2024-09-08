import { isAllCategory } from '../../pages/store/data/storeCategory';
import { toGoodsItems } from '../../pages/store/data/storeGoods';
import { allSpecId, isAllSpec } from '../../pages/store/data/storeSpec';
import log from '../../utils/log';
import queryGoods from '../db/queryGoods';

export default async function (storeCategory, storeSpec, storeGoods, categoryId, specId, loadMore = false) {
  const tag = 'fetchStoreGoodsData';
  // 1. 有上次的记录，直接展示上次记录
  const last = storeGoods.getGoodsData(categoryId, specId);
  if (last != null) {
    log.info(tag, 'hit cache', last);
    // 1.1 加载过，尝试加载更多的数据
    if (loadMore === true) {
      log.info(tag, 'try to load more data', 'TODO');
    }
    return last;
  }
  // 2. 没有缓存，但是标记了加载更多，这是不符合逻辑的，需要强制加载首页数据
  if (loadMore === true) {
    log.info(tag, 'Unknown error, no cached data should not load more, force load first page data!');
    // loop through
  }
  // 3. 首次加载[某个分类]/[某个规格]的商品
  // 3.1. 如果是[全部分类]/[全部规格]
  const isSpecAll = isAllSpec(specId);
  const isCategoryAll = isAllCategory(categoryId);
  if (isCategoryAll && isSpecAll) {
    try {
      const { records, total } = await queryGoods({});
      storeGoods.setGoodsListToCache(records);
      const data = {
        items: toGoodsItems(records),
        total: total,
        pageNumber: 1,
      };
      storeGoods.setGoodsData(categoryId, specId, data);
      log.info(tag, 'from api', data);
      return data;
    } catch (e) {
      log.error(tag, e);
      return emptyGoodsData();
    }
  }
  // 3.2 如果是[全部分类]/[XX规格]，则从规格的商品列表加载。
  if (isCategoryAll) {
    const data = await fetchStoreGoodsDataFromSpecs(tag, storeCategory, storeSpec, storeGoods, categoryId, specId);
    log.info(tag, 'from spec', data);
    return data;
  }
  // 3.3 如果是[XX分类]/[全部规格]，则从分类的商品列表加载。
  if (isSpecAll) {
    const data = await fetchStoreGoodsDataFromCategory(tag, storeCategory, storeSpec, storeGoods, categoryId, specId);
    log.info(tag, 'from category', data);
    return data;
  }
  // 3.4 [XX分类]/[xx规格]
  // 3.4.1 在分类中，找出所有具有[xx分类]的商品。
  // 3.4.2 在规格中，找出所有具有[xx规格]的商品。

  return {};
}

async function fetchStoreGoodsDataFromSpecs(
  tag,
  storeCategory,
  storeSpec,
  storeGoods,
  categoryId,
  specId,
  loadMore = false,
) {
  const spec = storeSpec.getSpec(categoryId, specId);
  if (!spec || spec === null) {
    log.error(tag, 'Unexpeced error happened, maybe restart app.');
    return emptyGoodsData();
  }
  const gsIds = spec.goods_spec?.map(({ _id }) => _id) || [];
  if (gsIds.length <= 0) {
    log.info(tag, 'no spec related goods.');
    return emptyGoodsData();
  }
  const { cached, noCached } = storeGoods.getGoodsListFromGoodsSpecCache(gsIds, true);
  log.info(
    tag,
    `This category has ${gsIds.length} goods`,
    `and ${cached.length} cached, and ${noCached.length} not cached!`,
  );
  let goods = null;
  if (noCached.length > 0) {
    try {
      const { records } = await queryGoods({ gsId: noCached });
      storeGoods.setGoodsListToCache(records);
    } catch (e) {
      log.error(tag, e);
      return emptyGoodsData();
    }
    const { cached: newCached } = storeGoods.getGoodsListFromGoodsSpecCache(gsIds);
    goods = newCached;
  } else {
    goods = cached;
  }
  const data = {
    items: toGoodsItems(goods),
    total: gsIds.length,
    pageNumber: 1,
  };
  storeGoods.setGoodsData(categoryId, specId, data);
  return data;
}

async function fetchStoreGoodsDataFromCategory(
  tag,
  storeCategory,
  storeSpec,
  storeGoods,
  categoryId,
  specId,
  loadMore = false,
) {
  const category = storeCategory.getCategory(categoryId);
  if (!category) {
    throw new Error('Unknown error, no selected category');
  }
  const gcIds = category?.goods_category?.map(({ _id }) => _id) || [];
  if (gcIds.length <= 0) {
    log.info(tag, 'no goods');
    return emptyGoodsData();
  }
  const { cached, noCached } = storeGoods.getGoodsListFromGoodsCategoryCache(gcIds, true);
  log.info(tag, `This category has ${gcIds} goods`, `and ${cached.size} cached, and ${noCached.size} not cached!`);
  let goods = null;
  if (noCached.length > 0) {
    try {
      const { records } = await queryGoods({ gcIds: noCached });
      storeGoods.setGoodsListToCache(records);
    } catch (e) {
      log.error(tag, e);
      return emptyGoodsData();
    }
    const { cached: newCached } = storeGoods.getGoodsListFromGoodsCategoryCache(gcIds);
    goods = newCached;
  } else {
    goods = cached;
  }
  const data = {
    items: toGoodsItems(goods),
    total: gcIds.length,
    pageNumber: 1,
  };
  storeGoods.setGoodsData(categoryId, specId, data);
  return data;
}

async function fetchStoreGoodsDataFromCategoryAndSpec(
  tag,
  storeCategory,
  storeSpec,
  storeGoods,
  categoryId,
  specId,
  loadMore = false,
) {
  // 1. 加载指定商品分类对应的[商品分类]信息，即某个品类下，可能的商品列表。
  const category = storeCategory.getCategory(categoryId);
  if (!category) {
    throw new Error('Unknown error, no selected category');
  }
  const gcIds = category?.goods_category?.map(({ _id }) => _id) || [];
  if (gcIds.length <= 0) {
    log.info(tag, 'no goods');
    return emptyGoodsData();
  }
  // 2. 加载指定商品规格对应的[商品规格]信息，即某个品类下，可能的商品列表。
  const spec = storeSpec.getSpec(categoryId, specId);
  if (!spec || spec === null) {
    log.error(tag, 'Unexpeced error happened, maybe restart app.');
    return emptyGoodsData();
  }
  const gsIds = spec.goods_spec?.map(({ _id }) => _id) || [];
  if (gsIds.length <= 0) {
    log.info(tag, 'no spec related goods.');
    return emptyGoodsData();
  }
}
