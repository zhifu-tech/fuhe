import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';
import { autorun, toJS } from 'mobx-miniprogram';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  data: {
    goodsSelected: null,
    goodsList: [],
  },
  watch: {
    hostAttached: function () {
      this.addToAutoDisposable(
        autorun(() => {
          const goodsSelected = stores.goods.selected;
          log.info(this.data.tag, 'goodsSelected', goodsSelected);
          this.setData({ goodsSelected });
        }),
        autorun(() => {
          const goodsSpuList = stores.goods.selected.spuList;
          this.setData({ goodsList: this.filterWithSearchKey(goodsSpuList) });
        }),
      );
    },
    categorySelected: function (cId) {
      const { tag, goodsSelected } = this.data;
      if (goodsSelected && goodsSelected.cId !== cId) {
        // 切换分类时，重新加载商品列表
        services.goods.switchGoodsSpuList({ tag, cId, trigger: 'init' });
        if (services.goods.checkNeedFetchedData({ tag, cId })) {
          log.info(tag, 'switchGoodsSpuList needFetch');
          this.addToAutoDisposable(
            services.goods.fetchGoodsSpuList({
              tag,
              cId,
              trigger: 'switch',
              pageNumber: 1,
              callback: this._updatePageStatus.bind(this),
            }),
          );
        }
      }
    },
  },
  methods: {
    loadMoreGoods: function () {
      const { tag, goodsSelected } = this.data;
      if (this.isPageLoading()) {
        log.info(tag, 'loadMoreGoods', 'intercepted as being loading!');
        return;
      }
      if (this.isPageNoMore()) {
        log.info(tag, 'loadMoreGoods', 'intercepted as being no more!');
        return;
      }
      this.addToAutoDisposable({
        key: 'loadMoreGoods',
        disposer: services.goods.fetchGoodsSpuList({
          tag,
          cId: goodsSelected.cId,
          pageNumber: goodsSelected.pageNumber + 1,
          trigger: 'more',
          callback: this._updatePageStatus.bind(this),
        }),
      });
    },
    pullDownRefresh: function () {
      const { tag, goodsSelected } = this.data;
      if (this.isPageLoading()) {
        log.info(tag, 'pullDownRefresh', 'intercepted as being loading!');
        return;
      }
      this.addToAutoDisposable({
        key: 'pullDownRefresh',
        disposer: services.goods.fetchGoodsSpuList({
          tag,
          cId: goodsSelected.cId,
          pageNumber: 1,
          trigger: 'pullDown',
          callback: this._updatePageStatus.bind(this),
        }),
      });
    },
    _updatePageStatus: function (status) {
      const { code, error, trigger } = status;
      const { tag, goodsSelected } = this.data;

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
          if (goodsSelected.spuList.length === 0) {
            this.showPageEmpty();
          } else if (goodsSelected.spuList.length >= total) {
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
        popup.showGoodsAddSpuPopup(this, {
          title: '添加商品',
        });
      }, ({ mod, errMsg }) => {
        console.error(`path: ${mod}, ${errMsg}`);
      });
    },
  },
});
