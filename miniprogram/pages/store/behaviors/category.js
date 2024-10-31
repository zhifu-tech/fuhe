import log from '@/common/log/log';
import store from '@/stores/store';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  data: {
    categoryPopup: {
      enabled: false,
      options: null,
    },
  },
  watch: {
    categorySelected: function (selected) {
      const { categoryList } = this.data;
      if (categoryList.length === 0) {
        // 未加载过分类列表时，先加载分类列表
        store.category.fetchCategoryList({ tag: 'store-category' });
      }
    },
  },
});
