import log from '@/common/log/log';
import { autorun } from 'mobx-miniprogram';
import orderStore from '../../../stores/order/index';
import orderService from '../../../services/order/index';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  data: {
    orderList: [],
  },
  watch: {
    hostAttached: function () {
      const { tag } = this.data;
      this.addToAutoDisposable(
        autorun(() => {
          const orderList = orderStore.selected.orderList;
          log.info(tag, 'observe orderList', orderList);
          this.setData({ orderList });
        }),
        autorun(() => {
          const filter = orderStore.selected.filter;
          if (!orderStore.hasFetchedData(filter)) {
            this.addToAutoDisposable({
              key: 'switchOrderList',
              disposer: orderService.fetchOrderList({
                tag,
                trigger: 'switch',
                filter,
                pageNumber: 1,
                callback: this._updatePageStatus.bind(this),
              }),
            });
          }
        }),
      );
    },
  },
  methods: {
    loadMoreContent: function () {
      const { tag } = this.data;
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
        disposer: orderService.fetchOrderList({
          tag,
          trigger: 'loadMore',
          filter: orderStore.selected.filter,
          pageNumber: orderStore.selected.pageNumber + 1,
          callback: this._updatePageStatus.bind(this),
        }),
      });
    },
    pullDownRefresh: function () {
      const { tag } = this.data;
      if (this.isPageLoading()) {
        log.info(tag, 'pullDownRefresh', 'intercepted as being loading!');
        return;
      }
      this.addToAutoDisposable({
        key: 'pullDownRefresh',
        disposer: orderService.fetchOrderList({
          tag,
          trigger: 'pullDown',
          filter: orderStore.selected.filter,
          pageNumber: 1,
          callback: this._updatePageStatus.bind(this),
        }),
      });
    },

    _updatePageStatus: function ({ code, error, trigger, total }) {
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
          const { orderList, total } = orderStore.selected;
          if (orderList.length === 0) {
            this.showPageEmpty();
          } else if (orderList.length >= total) {
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
});
