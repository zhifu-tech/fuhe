import log from '../../../../../common/log/log';
import services from '../../../../../services/index';

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
        log.info('goods', 'category.selected');
        goods._selectedCategory = category.selected;
        this._fetchGoodsList({ pageNumber: 1, refresh: true });
      }
    },
  },
  methods: {
    _initGoods: async function () {
      log.info('goods', '_initGoods');
      await this._fetchGoodsList({ pageNumber: 1, refresh: true });
    },
    onScrollToLower: async function () {
      log.info('goods', 'onScrollToLower');

      if (this.isLoadMoreLoading()) {
        return;
      }
      if (this.hasLoadMoreAll()) {
        return;
      }
      const {
        goods: { pageNumber = 1 },
      } = this.data;
      await this._fetchGoodsList({
        pageNumber: pageNumber + 1,
      });
    },
    _fetchGoodsList: async function ({ pageNumber, refresh }) {
      log.info('goods', '_fetchGoodsList', { pageNumber, refresh });
      const {
        tag,
        goods: { items, selectedCategory },
      } = this.data;
      if (items.length === 0) {
        this.hideEmpty();
        this.showToastLoading();
      } else {
        this.showLoadMoreLoading();
      }
      const { records: spuList, total } = await services.goods.spuList({
        tag,
        cId: selectedCategory,
        pageNumber,
        pageSize: 10,
      });
      if (total === 0) {
        this.showEmpty();
        this.hideToast();
        this.hideLoadMore();
      } else if (items.length + spuList.length >= total) {
        this.showLoadMoreAll();
        this.hideEmpty();
        this.hideToast();
      } else {
        this.hideLoadMore();
        this.hideEmpty();
        this.hideToast();
      }
      if (refresh) {
        this.setData({
          total,
          pageNumber: 1,
          'goods.items': [...spuList],
        });
      } else {
        this.setData({
          total,
          pageNumber: pageNumber + 1,
          'goods.items': [...items, ...spuList],
        });
      }
    },
  },
});
