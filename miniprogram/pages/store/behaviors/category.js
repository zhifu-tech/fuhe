import log from '@/common/log/log';
import stores from '@/stores/index';
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
      if (selected === stores.category.categoryAdd._id) {
        // 首次加载选中的是新增分类信息，需要加载分类列表
        this.fetchCategoryListTask = services.category.fetchCategoryList({
          tag: 'store-category',
          trigger: 'init',
          callback: this._fetchCategoryListCallback.bind(this),
        });
      }
    },
  },
  lifetimes: {
    detached: function () {
      this.fetchCategoryListTask?.dispose();
      this.fetchCategoryListTask = undefined;
    },
  },
  methods: {
    _fetchCategoryListCallback: function (status) {
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
