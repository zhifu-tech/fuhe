import log from '@/common/log/log';

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
      log.info('category-2', 'watch', 'categorySelected', selected);
      const { categoryList } = this.data;
      if (categoryList.length === 0) {
        // 未加载过分类列表时，先加载分类列表
        this.fetchCategoryList({ tag: 'store-category' });
      }
    },
  },
});
