module.exports = Behavior({
  data: {
    empty: 0,
    loadMoreStatus: 0,
  },
  methods: {
    isLoadMoreLoading: function () {
      return this.data.loadMoreStatus === 1;
    },
    hasLoadMoreAll: function () {
      return this.data.loadMoreStatus === 2;
    },
    showLoadMoreLoading: function () {
      this.setData({
        loadMoreStatus: 1,
      });
    },
    showLoadMoreAll: function () {
      this.setData({
        loadMoreStatus: 2,
      });
    },
    showLoadMoreFailed: function () {
      this.setData({
        loadMoreStatus: 3,
      });
    },
    hideLoadMore: function () {
      this.setData({
        loadMoreStatus: 0,
      });
    },
    showEmpty: function () {
      this.setData({
        empty: 1,
      });
    },
    hideEmpty: function () {
      this.setData({
        empty: 0,
      });
    },
  },
});
