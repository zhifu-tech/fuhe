module.exports = Behavior({
  data: {
    pageStatus: {
      isLoadingWithSkeleton: false,
      isLoadingWithMore: false,
      isLoadingWithPullDown: false,

      isEmpty: false,
      showNoMore: false,
      showHasMore: false,
      showRetry: false,
    },
  },
  methods: {
    isPageLoading: function () {
      const { pageStatus } = this.data;
      return (
        pageStatus.isLoadingWithSkeleton ||
        pageStatus.isLoadingWithMore ||
        pageStatus.isLoadingWithPullDown
      );
    },

    showPageLoadingWithSkeleton: function () {
      const { pageStatus } = this.data;
      if (pageStatus.isLoadingWithSkeleton) return;
      this.setData({
        ...this.hidePageLoadMore(),
        'pageStatus.isLoadingWithSkeleton': true,
      });
    },
    hidePageLoadigWithSkeleton: function () {
      const { pageStatus } = this.data;
      if (pageStatus.isLoadingWithSkeleton) {
        return {
          'pageStatus.isLoadingWithSkeleton': false,
        };
      }
      return {};
    },

    showPageLoadingWithMore: function () {
      const { pageStatus } = this.data;
      if (pageStatus.isLoadingWithMore) return;
      this.setData({
        ...this.hidePageLoadMore(),
        'pageStatus.isLoadingWithMore': true,
      });
    },
    hidePageLoadigWithMore: function () {
      const { pageStatus } = this.data;
      if (pageStatus.isLoadingWithMore) {
        return {
          'pageStatus.isLoadingWithMore': false,
        };
      }
      return {};
    },
    showPageLoadingWithPullDown: function () {
      const { pageStatus } = this.data;
      if (pageStatus.isLoadingWithPullDown) return;
      this.setData({
        'pageStatus.isLoadingWithPullDown': true,
      });
    },
    hidePageLoadigWithPullDown: function () {
      const { pageStatus } = this.data;
      if (pageStatus.isLoadingWithPullDown) {
        return {
          'pageStatus.isLoadingWithPullDown': false,
        };
      }
      return {};
    },
    _hidePageLoading: function () {
      return {
        ...this.hidePageLoadigWithSkeleton(),
        ...this.hidePageLoadigWithMore(),
        ...this.hidePageLoadigWithPullDown(),
      };
    },

    isPageNoMore: function () {
      const { pageStatus } = this.data;
      return pageStatus.showNoMore;
    },

    showPageEmpty: function () {
      this.setData({
        ...this._hidePageLoading(),
        'pageStatus.isEmpty': true,
        'pageStatus.showNoMore': false,
        'pageStatus.showHasMore': false,
        'pageStatus.showRetry': false,
      });
    },
    showPageNoMore: function () {
      this.setData({
        ...this._hidePageLoading(),
        'pageStatus.isEmpty': false,
        'pageStatus.showNoMore': true,
        'pageStatus.showHasMore': false,
        'pageStatus.showRetry': false,
      });
    },
    showPageHasMore: function () {
      this.setData({
        ...this._hidePageLoading(),
        'pageStatus.isEmpty': false,
        'pageStatus.showNoMore': false,
        'pageStatus.showHasMore': true,
        'pageStatus.showRetry': false,
      });
    },
    showPageError: function () {
      this.setData({
        ...this._hidePageLoading(),
        'pageStatus.isEmpty': false,
        'pageStatus.showNoMore': false,
        'pageStatus.showHasMore': false,
        'pageStatus.showRetry': true,
      });
    },
    hidePageLoadMore: function () {
      return {
        'pageStatus.isEmpty': false,
        'pageStatus.showNoMore': false,
        'pageStatus.showHasMore': false,
        'pageStatus.showRetry': false,
      };
    },
  },
});
