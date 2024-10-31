import log from '@/common/log/log';
import store from '@/stores/store';
import services from '@/services/index';

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
  if (cId && cId !== store.category.categoryAll._id) {
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
  const cIdSpecListMap = await services.spec.getSpecListBatch({ tag, cIdList });
  spuList.forEach((spu) => {
    spu.specList = cIdSpecListMap.get(spu.cId) || [];
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

  const skuIdList = [];
  spuList.forEach((spu) => {
    spu.skuList.forEach((sku) => {
      skuIdList.push(sku._id);
    });
  });
  const { records: stockList } = await services.stock.listBatch({
    tag,
    skuIdList: skuIdList,
  });

  spuList.forEach((spu) => {
    spu.skuList.forEach((sku) => {
      sku.stockList = [];
      let index = 0;
      // 遍历找到第一个匹配的 skuId
      while (index < stockList.length && stockList[index].skuId !== sku._id) index++;
      if (index >= stockList.length) return;
      const startIndex = index;
      // 添加所有匹配的库存记录
      while (index < stockList.length && stockList[index].skuId === sku._id) {
        sku.stockList.push(stockList[index]);
        index++;
      }
      // 移除已经添加的记录
      skuIdList.splice(startIndex, index - startIndex);
    });
  });
};
