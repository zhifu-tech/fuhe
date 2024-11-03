import log from '@/common/log/log';
import store from '@/stores/store';
import services from '@/services/index';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  data: {
    showCategorySkeleton: true,
    categoryPopup: {
      enabled: false,
      options: null,
    },
  },
  watch: {
    categorySelected: function (selected) {
      log.info('category', 'watch', 'categorySelected', selected);
      if (selected === store.category.categoryAdd._id) {
        // 首次加载选中的是新增分类信息，需要加载分类列表
        services.category.fetchCategoryList({
          tag: 'store-category',
          trigger: 'init',
        });
      }
    },
    fetchCategoryListStatus: function (status) {
      this._updateCategoryListStatus(status);
    },
  },
  methods: {
    _updateCategoryListStatus: function (status) {
      const { tag, categoryExtList } = this.data;
      const { code, trigger } = status;
      switch (code) {
        case 'loading': {
          if (trigger === 'init') {
            // 初始化时，显示加载中Skeleton
            this.setData({ showCategorySkeleton: true });
          }
          break;
        }
        case 'success': {
          if (trigger === 'init') {
            // 初始化时，显示加载中Skeleton
            this.setData({ showCategorySkeleton: false });
            // 加载显示首个分类选项
            if (categoryExtList.length > 1) {
              store.category.switchSelectedCategory({
                tag,
                cId: categoryExtList[0]._id,
              });
            }
          }
          break;
        }
        case 'error': {
          if (trigger === 'init') {
            // 初始化时，显示加载中Skeleton
            this.setData({ showCategorySkeleton: false });
          }
          break;
        }
      }
    },
  },
});
