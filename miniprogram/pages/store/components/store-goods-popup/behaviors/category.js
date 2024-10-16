const { default: services } = require('../../../../../services/index');

module.exports = Behavior({
  methods: {
    handleUpdateSpuCategory: async function (picked) {
      // 1. 更新SPU类别信息
      const category = picked || {};
      // 2. 加载规格信息
      const { records: specList } = await services.spec.crud.list({
        tag: 'goods-spu-category',
        cId: category._id,
        loadFromCacheEnabled: true,
      });
      // 3. 更新关联信息
      const { spu, sku } = this.data;
      spu.category = category;
      spu.specList = specList;
      // 4. 商品类别发生变化，其对应的sku信息需要重置
      sku.optionList = this.promoteOptionList(spu);
      this.setData({
        'spu.category': spu.category,
        'spu.specList': spu.specList,
        'sku.optionList': sku.optionList,
      });
    },
    promoteOptionList(spu) {
      if (!spu.specList) return null;
      // 增加默认选项的处理，一定概率省去点击的操作。
      // 默认选项需要没有被选中过。可以通过深度优先的方式遍历即可。
      const selected = [];
      spu.skuList?.forEach((sku) => {
        selected.push(sku.optionList);
      });
      const res = _findOptionList(spu.specList, selected);
      return res || [];
    },
  },
});

function _findOptionList(specList, selected, res = [], index = 0) {
  if (res.length === specList.length) {
    return !_checkHasSelected(res, selected) ? res : null;
  }
  const spec = specList[index];
  for (const option of spec.optionList) {
    const nextRes = [...res, option];
    const result = _findOptionList(specList, selected, nextRes, index + 1);
    if (result) {
      return result;
    }
  }
  return null;
}
function _checkHasSelected(res, selected) {
  // 检查res是否存在于selected 中
  if (selected.length === 0) {
    return false;
  } else {
    return selected.some((list) => res.every((option, index) => option._id === list[index]._id));
  }
}
