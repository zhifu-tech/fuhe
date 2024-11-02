import log from '@/common/log/log';
import store from '@/stores/store';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  watch: {
    categorySelected: function (categorySelected) {
      const { goods, tag } = this.data;
      if (goods.cId !== categorySelected) {
        // 切换分类时，重新加载商品列表
        store.goods.switchGoodsSpuList({
          tag: this.data.tag,
          cId: categorySelected,
          trigger: 'switch',
        });
      }
    },
    fetchGoodsSpuListStatus: function (status) {
      this._updatePageStatus(status);
    },
  },
  methods: {
    loadMoreGoods: function () {
      const { tag, goods } = this.data;
      if (this.isPageLoading()) {
        log.info(tag, 'loadMoreGoods', 'intercepted as being loading!');
        return;
      }
      if (this.isPageNoMore()) {
        log.info(tag, 'loadMoreGoods', 'intercepted as being no more!');
        return;
      }
      log.info(tag, 'loadMoreGoods');
      store.goods.fetchGoodsSpuList({
        tag,
        cId: goods.cId,
        pageNumber: goods.pageNumber + 1,
        trigger: 'more',
      });
    },
    pullDownRefresh: function () {
      const { tag, goods } = this.data;
      if (this.isPageLoading()) {
        log.info(tag, 'pullDownRefresh', 'intercepted as being loading!');
        return;
      }
      log.info(tag, 'pullDownRefresh');
      store.goods.fetchGoodsSpuList({
        tag,
        cId: goods.cId,
        pageNumber: 1,
        trigger: 'pullDown',
      });
    },
    _updatePageStatus: function (status) {
      const { tag, goods } = this.data;
      const { code, error, trigger } = status;
      switch (code) {
        case 'loading': {
          if (trigger === 'switch') {
            this.showPageLoadingWithSkeleton();
          } else if (trigger === 'more') {
            this.showPageLoadingWithMore();
          } else if (trigger === 'pullDown') {
            this.showPageLoadingWithPullDown();
          }
          break;
        }
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
    handleShowGoodsPopup: function () {
      require('@/package-goods/goods/popup/popup.js', (popup) => {
        popup.showGoodsAddSpuPopup(this, {});
      }, ({ mod, errMsg }) => {
        console.error(`path: ${mod}, ${errMsg}`);
      });
    },
  },
});
