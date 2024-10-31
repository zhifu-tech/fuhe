import log from '@/common/log/log';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  watch: {
    goods: function (goods) {
      if (goods.isDefault) {
        this._initGoods();
      }
    },
    fetchGoodsSpuListStatus: function (status) {
      this._updatePageStatus(status);
    },
    categorySelected: function (categorySelected) {
      if (this.data.goods.cId !== categorySelected) {
        this.switchSelectedGoodsSpuList(categorySelected);
      }
    },
  },
  methods: {
    _initGoods: function () {
      const { tag, goods, categorySelected } = this.data;
      if (this.isPageLoading()) {
        log.info(tag, '_initGoods', 'intercepted as being loading!');
        return;
      }
      this.showPageLoadingWithSkeleton();
      this.fetchGoodsSpuList({
        tag,
        cId: categorySelected,
        pageNumber: 1,
      });
    },
    loadMoreGoods: function () {
      const { tag, goods, categorySelected } = this.data;
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
        cId: categorySelected,
        pageNumber: goods.pageNumber + 1,
      });
    },
    pullDownRefresh: function () {
      const { tag, goods, categorySelected } = this.data;
      if (this.isPageLoading()) {
        log.info(tag, 'pullDownRefresh', 'intercepted as being loading!');
        return;
      }
      this.showPageLoadingWithPullDown();
      this.fetchGoodsSpuList({
        tag,
        cId: categorySelected,
        pageNumber: 1,
      });
    },
    _updatePageStatus: function (status) {
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
    handleShowGoodsPopup: function () {
      require('@/package-goods/goods/popup/popup.js', (popup) => {
        popup.showGoodsAddSpuPopup(this, {});
      }, ({ mod, errMsg }) => {
        console.error(`path: ${mod}, ${errMsg}`);
      });
    },
    handleGoodsSkuDelete: function (e) {
      const { tag } = this.data;
      log.info(tag, 'handleGoodsSkuDelete', e);
    },
  },
});
