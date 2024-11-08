import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  watch: {
    categorySelected: function (cId) {
      const { goods, tag } = this.data;
      if (goods.cId !== cId) {
        // 切换分类时，重新加载商品列表
        services.goods.switchGoodsSpuList({ tag, cId, trigger: 'init' });
        if (services.goods.checkNeedFetchedData({ tag, cId })) {
          log.info(tag, 'switchGoodsSpuList needFetch');
          this.fetchGoodsTask = services.goods.fetchGoodsSpuList({
            tag,
            cId,
            trigger: 'switch',
            pageNumber: 1,
            callback: this._updatePageStatus.bind(this),
          });
        }
      }
    },
  },
  lifetimes: {
    detached: function () {
      if (this.fetchGoodsTask) {
        this.fetchGoodsTask.abort();
        this.fetchGoodsTask = undefined;
      }
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
      this.fetchGoodsTask = services.goods.fetchGoodsSpuList({
        tag,
        cId: goods.cId,
        pageNumber: goods.pageNumber + 1,
        trigger: 'more',
        callback: this._updatePageStatus.bind(this),
      });
    },
    pullDownRefresh: function () {
      const { tag, goods } = this.data;
      if (this.isPageLoading()) {
        log.info(tag, 'pullDownRefresh', 'intercepted as being loading!');
        return;
      }
      this.fetchGoodsTask = services.goods.fetchGoodsSpuList({
        tag,
        cId: goods.cId,
        pageNumber: 1,
        trigger: 'pullDown',
        callback: this._updatePageStatus.bind(this),
      });
    },
    _updatePageStatus: function (status) {
      const { code, error, trigger } = status;
      const { tag, goods } = this.data;

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
          const { total } = status;
          if (goods.spuList.length === 0) {
            this.showPageEmpty();
          } else if (goods.spuList.length >= total) {
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
