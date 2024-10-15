import log from '../../common/log/log';
import services from '../index';

export default async function ({ tag, cId, pageNumber, pageSize }) {
  const params = {
    select: {
      _id: true,
      cId: true,
      title: true,
      desc: true,
      category: {
        _id: true,
        title: true,
      },
      skuList: {
        _id: true,
        imageList: true,
        optionIdList: true,
      },
      createdAt: true, // 2024-10-12 08:17:42
      updatedAt: true, // 2024-10-12 08:17:42
    },
    orderBy: [
      { createdAt: 'desc' }, // 创建时间升序排列
    ],
    getCount: true,
    pageNumber: pageNumber,
    pageSize: pageSize,
  };
  if (cId && cId !== services.category.allCategoryId) {
    params['filter'] = {
      where: {
        cId: { $eq: cId },
      },
    };
  }
  try {
    const { data } = await wx.cloud.models.fh_goods_spu.list(params);
    const { records: spuList = [] } = data;

    await _handleSpuSpecList(tag, spuList);
    _handleSkuOptionList(spuList);
    await _handleSkuStockList(tag, spuList);

    log.info(tag, 'goods-spu-list', data);
    return data;
  } catch (error) {
    log.error(tag, 'goods-spu-list', error);
    throw error;
  }
}

const _handleSpuSpecList = async function (tag, spuList) {
  if (!spuList || spuList.length <= 0) return;
  // 创建一个 Set 来保存所有的 cId，并去重
  const cIdSet = new Set();
  spuList.forEach(({ cId }) => {
    if (cId) cIdSet.add(cId);
  });
  const cIdList = Array.from(cIdSet);

  // 批量执行所有请求
  const promises = cIdList.map((cId) =>
    services.spec.crud.list({
      tag,
      cId,
      loadFromCacheEnabled: true,
    }),
  );
  const specListResult = await Promise.all(promises);

  // 将请求结果映射到 cIdMap 中
  const cIdMap = new Map();
  cIdList.forEach((cId, index) => {
    cIdMap.set(cId, specListResult[index].records);
  });

  // 将对应的规格列表添加到 spuList 中
  spuList.forEach((spu) => {
    spu.specList = (spu.cId && cIdMap.get(spu.cId)) ?? [];
  });
};

const _handleSkuOptionList = function (spuList) {
  spuList.forEach((spu) => {
    if (!spu.skuList) return;
    if (spu.specList.length === 0) return;
    spu.skuList.forEach((sku) => {
      if (!sku.optionIdList) {
        sku.optionList = [];
        return;
      }
      sku.optionList = sku.optionIdList.map((optionId) => {
        let target = {};
        spu.specList.find((spec) => {
          target = spec.optionList.find((option) => option._id === optionId);
          return target;
        });
        return target || {};
      });
    });
  });
};

const _handleSkuStockList = async function (tag, spuList) {
  if (!spuList || spuList.length <= 0) return;
  const promises = [];
  spuList.forEach((spu) => {
    const skuPromises = spu.skuList.map((sku) => services.goods.stockList({ tag, skuId: sku._id }));
    promises.push(...skuPromises);
  });
  const resultList = await Promise.all(promises);
  let index = 0;
  spuList.forEach((spu) => {
    spu.skuList.forEach((sku) => {
      sku.stockList = resultList[index++].records;
    });
  });
};
