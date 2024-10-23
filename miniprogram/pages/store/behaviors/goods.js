import log from '@/common/log/log';
import services from '@/services/index';

module.exports = Behavior({
  data: {
    goods: {
      items: [],
      _total: 0,
      _pageNumber: 0,
      _selectedCategory: services.category.allCategoryId,
    },
  },
  observers: {
    'category.selected': function () {
      const { goods, category } = this.data;
      if (goods._selectedCategory !== category.selected) {
        this.setData({
          'goods.items': [],
          'goods._total': 0,
          'goods._pageNumber': 0,
          'goods._selectedCategory': category.selected,
        });
        this._initGoods();
      }
    },
  },
  pageLifetimes: {
    show: function () {
      if (this._checGoodsNeedInit()) {
        this._initGoods();
      }
    },
  },
  methods: {
    _checGoodsNeedInit: function () {
      return this.data.goods.items.length === 0;
    },
    _initGoods: async function () {
      const { tag, goods } = this.data;
      if (this.isPageLoading()) {
        log.info(tag, '_initGoods', 'intercepted as being loading!');
        return;
      }
      this.showPageLoadingWithSkeleton();
      try {
        await this._fetchGoodsList({ pageNumber: 1, refresh: true });

        if (goods.items.length === 0) {
          this.showPageEmpty();
        } else if (goods.items.length >= goods._total) {
          this.showPageNoMore();
        } else {
          this.showPageHasMore();
        }
      } catch (error) {
        log.error(tag, '_initGoods', error);
        this.showPageError(error);
      }
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
      try {
        await this._fetchGoodsList({
          pageNumber: goods._pageNumber + 1,
        });

        if (goods.items.length === 0) {
          this.showPageEmpty();
        } else if (goods.items.length >= goods._total) {
          this.showPageNoMore();
        } else {
          this.showPageHasMore();
        }
      } catch (error) {
        log.error(tag, 'loadMoreGoods', error);
        this.showPageError();
      }
    },
    pullDownRefresh: async function () {
      const { tag, goods } = this.data;
      if (this.isPageLoading()) {
        log.info(tag, 'pullDownRefresh', 'intercepted as being loading!');
        return;
      }
      this.showPageLoadingWithPullDown();
      try {
        await this._fetchGoodsList({ pageNumber: 1 });

        if (goods.items.length === 0) {
          this.showPageEmpty();
        } else if (goods.items.length >= goods._total) {
          this.showPageNoMore();
        } else {
          this.showPageHasMore();
        }
      } catch (error) {
        log.error(tag, 'pullDownRefresh', error);
        this.showPageError();
      }
    },
    _fetchGoodsList: async function ({ pageNumber }) {
      log.info('goods', '_fetchGoodsList', { pageNumber });
      const {
        tag,
        goods: { items, _selectedCategory },
      } = this.data;
      const { records: spuList, total } = await services.goods.spuList({
        tag,
        cId: _selectedCategory,
        pageNumber,
        pageSize: 10,
      });
      if (pageNumber === 1) {
        this.setData({
          'goods._total': total,
          'goods._pageNumber': pageNumber,
          'goods.items': [...spuList],
        });
        log.info(tag, '_fetchGoodsList', this.data.goods.items);
      } else {
        this.setData({
          'goods._total': total,
          'goods._pageNumber': pageNumber,
          'goods.items': [...items, ...spuList],
        });
      }
    },
  },
});
