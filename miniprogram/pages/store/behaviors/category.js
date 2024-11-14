import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';
import { autorun } from 'mobx-miniprogram';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  data: {
    categoryExtList: [],
    categorySelected: '',
    showCategorySkeleton: true,
    categoryPopup: {
      enabled: false,
      options: null,
    },
  },
  watch: {
    hostAttached: function () {
      log.info('storePage category', 'attached');
      this.addToAutoDisposable(
        autorun(() => {
          const categoryExtList = stores.category.categoryExtList || [];
          log.info(this.data.tag, 'categoryExtList', categoryExtList);
          this.setData({ categoryExtList });
        }),
        autorun(() => {
          const categorySelected = stores.category.selected;
          if (this.data.categorySelected != categorySelected) {
            log.info(this.data.tag, 'categorySelected', categorySelected);
            this.setData({ categorySelected });
          }
        }),
      );
    },
    categorySelected: function (selected) {
      if (selected === stores.category.categoryAdd._id) {
        // 首次加载选中的是新增分类信息，需要加载分类列表
        this.addToAutoDisposable(
          services.category.fetchCategoryList({
            tag: 'store-category',
            trigger: 'init',
            callback: this._fetchCategoryListCallback.bind(this),
          }),
        );
      }
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
