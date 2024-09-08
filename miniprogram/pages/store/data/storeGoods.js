export default function () {
  const dataCache = new Map(); // <key:category_id+spec_id, value:{}>
  const goodsCache = new Map(); // <goods_category_id, goods>

  return {
    reset: () => {
      dataCache.clear();
      goodsCache.clear();
    },
    checkHasMore: function (categoryId, specId) {
      const { total, items } = this.getGoodsData(categoryId, specId);
      return total > items.length;
    },
    getGoodsData: function (categoryId, specId) {
      const key = `${categoryId}+${specId}`;
      return dataCache.get(key);
    },
    setGoodsData: function (categoryId, specId, data) {
      const key = `${categoryId}+${specId}`;
      dataCache.set(key, data);
    },

    setGoodsListToCache: function (list) {
      list?.forEach((goods) => {
        goods?.goods_category?.forEach(({ _id: gcId }) => {
          goodsCache.set(gcId, goods);
        });
        goods?.goods_spec?.forEach(({ _id: gsId }) => {
          goodsCache.set(gsId, goods);
        });
      });
    },
    getGoodsListFromGoodsCategoryCache: function (gcIds, needNoCache = false) {
      const cached = [];
      const noCached = needNoCache ? [] : null;
      gcIds.forEach((gcId) => {
        const goods = goodsCache.get(gcId);
        if (!goods || goods === null) {
          noCached?.push(gcId);
        } else {
          cached.push(goods);
        }
      });
      return { cached, noCached };
    },
    getGoodsListFromGoodsSpecCache: function (gsIds, needNoCache = false) {
      const cached = [];
      const noCached = needNoCache ? [] : null;
      gsIds.forEach((gsId) => {
        const goods = goodsCache.get(gsId);
        if (!goods || goods === null) {
          noCached?.push(gsId);
        } else {
          cached.push(goods);
        }
      });
      return { cached, noCached };
    },
  };
}

export function toGoodsItems(records) {
  return records.map((goods) => ({
    key: goods._id,
    item: goods,
  }));
}
export function emptyGoodsData() {
  return {
    items: [],
    total: 0,
    pageNumber: 0,
  };
}
