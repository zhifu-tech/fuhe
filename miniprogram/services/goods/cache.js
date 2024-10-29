export default (function () {
  const spuMap = new Map();
  const skuMap = new Map();
  return {
    reset: function () {
      spuMap.clear();
      skuMap.clear();
    },
    setSpuList: function (list) {
      list.forEach((spu) => {
        spuMap.set(spu._id, spu);
        spu.skuList?.forEach((sku) => {
          skuMap.set(sku._id, sku);
        });
      });
    },
    getSpu: function (id) {
      return spuMap.get(id);
    },
    getSpuWithDefault: function (id, def = {}) {
      return spuMap.get(id) || def;
    },
    getSku: function (id) {
      return skuMap.get(id);
    },
    getSkuWithDefault: function (id, def = {}) {
      return skuMap.get(id) || def;
    },
  };
})();
