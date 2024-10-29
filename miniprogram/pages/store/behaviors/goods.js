import log from '@/common/log/log';
import services from '@/services/index';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  observers: {
    'category.selected': function () {
      const { goods, category } = this.data;
      if (goods.cId !== category.selected) {
        this.switchSelectedGoodsSpuList(category.selected);
      }
    },
  },
  watch: {
    goods: function (goods) {
      if (goods.isDefault) {
        this._initGoods();
      }
    },
    fetchGoodsSpuListStatus: function (status) {
      const { tag, goods } = this.data;
      const { code, error } = status;
      switch (code) {
        case 'success': {
          if (goods.spuList.length === 0) {
            this.showPageEmpty();
          } else if (goods.spuList.length >= goods.total) {
            this.showPageNoMore();
          } else {
            this.showPageHasMore();
          }
          break;
        }
        case 'error': {
          this.showPageError(error);
          break;
        }
      }
    },
  },
  methods: {
    _initGoods: async function () {
      const { tag, goods, category } = this.data;
      if (this.isPageLoading()) {
        log.info(tag, '_initGoods', 'intercepted as being loading!');
        return;
      }
      this.showPageLoadingWithSkeleton();
      this.fetchGoodsSpuList({
        tag,
        cId: category.selected,
        pageNumber: 1,
      });
    },
    loadMoreGoods: async function () {
      const { tag, goods } = this.data;
      if (this.isPageLoading()) {
        log.info(tag, 'loadMoreGoods', 'intercepted as being loading!');
        return;
      }
      if (this.isPageNoMore()) {
        log.info(tag, 'loadMoreGoods', 'intercepted as being no more!');
        return;
      }
      this.showPageLoadingWithMore();
      this.fetchGoodsSpuList({
        tag,
        cId: category.selected,
        pageNumber: goods.pageNumber + 1,
      });
    },
    pullDownRefresh: async function () {
      const { tag, goods, category } = this.data;
      if (this.isPageLoading()) {
        log.info(tag, 'pullDownRefresh', 'intercepted as being loading!');
        return;
      }
      this.showPageLoadingWithPullDown();
      this.fetchGoodsSpuList({
        tag,
        cId: category.selected,
        pageNumber: 1,
      });
    },
  },
});
