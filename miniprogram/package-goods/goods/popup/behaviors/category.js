import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';
import { runInAction, autorun, when } from 'mobx-miniprogram';
import { showToastError } from '@/common/toast/simples';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  data: {
    categoryName: '',
    spuSpecList: [],
    skuOptionList: [],
  },
  lifetimes: {
    attached: function () {
      this.addToAutoDisposable(
        autorun(() => {
          const { tag, spu, sku } = this.data;
          log.info(tag, 'categoryName', spu, sku);
          this.setData({
            categoryName: spu.category?.title || '',
            spuSpecList: spu.specList || [],
          });
        }),
        autorun(() => {
          const { tag, spu, sku } = this.data;
          log.info(tag, 'skuOptionList', spu, sku);
          this.setData({
            skuOptionList: sku.optionList || [],
          });
        }),
      );
    },
  },
  methods: {
    showCategoryPicker: function () {
      wx.navigateTo({
        url: '/package-cso/category/list/index',
        events: {
          pickedCategory: this._handleUpdateSpuCategory.bind(this),
        },
      });
    },
    _handleUpdateSpuCategory: async function (categoryId) {
      const category = stores.category.getCategory(categoryId);
      if (!category) {
        showToastError({ message: '分类不存在，请重新选择！' });
        return;
      }
      // 2. 加载规格信息
      const specList = await services.spec.getSpecList({
        tag: 'goods-spu-category',
        cId: category._id,
      });
      // 3. 更新关联信息
      const { spu, sku } = this.data;
      runInAction(() => {
        spu.cId = category._id;
        spu.category = category;
        spu.specList = specList || [];
        // 4. 商品类别发生变化，其对应的sku信息需要重置
        sku.optionList = this.promoteOptionList(spu);
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
    handleOptionSelected: function (e) {
      const { tag, sku } = this.data;
      const { option } = e.target.dataset;
      log.info(tag, 'handleOptionSelected', option);
      runInAction(() => {
        sku.optionList = sku.optionList || [];
        // 每种规格，只允许选中一个
        const last = sku.optionList.findIndex(({ sId }) => sId === option.sId);
        if (last != -1) {
          sku.optionList.splice(last, 1);
        }
        sku.optionList.push(option);
      });
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
