module.exports = Behavior({
  data: {
    pageStatus: {
      isLoadingWithSkeleton: true,
      isLoadingWithSkeletonDelay: true,
      isLoadingWithMore: false,
      isLoadingWithPullDown: false,

      showEmpty: false,
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
        'pageStatus.isLoadingWithSkeletonDelay': true,
      });
    },
    hidePageLoadigWithSkeleton: function () {
      const { pageStatus } = this.data;
      if (pageStatus.isLoadingWithSkeleton) {
        setTimeout(() => {
          this.setData({
            'pageStatus.isLoadingWithSkeletonDelay': false,
          });
        }, 300);
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
        'pageStatus.showEmpty': true,
        'pageStatus.showNoMore': false,
        'pageStatus.showHasMore': false,
        'pageStatus.showRetry': false,
      });
    },
    showPageNoMore: function () {
      this.setData({
        ...this._hidePageLoading(),
        'pageStatus.showEmpty': false,
        'pageStatus.showNoMore': true,
        'pageStatus.showHasMore': false,
        'pageStatus.showRetry': false,
      });
    },
    showPageHasMore: function () {
      this.setData({
        ...this._hidePageLoading(),
        'pageStatus.showEmpty': false,
        'pageStatus.showNoMore': false,
        'pageStatus.showHasMore': true,
        'pageStatus.showRetry': false,
      });
    },
    showPageError: function () {
      this.setData({
        ...this._hidePageLoading(),
        'pageStatus.showEmpty': false,
        'pageStatus.showNoMore': false,
        'pageStatus.showHasMore': false,
        'pageStatus.showRetry': true,
      });
    },
    hidePageLoadMore: function () {
      return {
        'pageStatus.showEmpty': false,
        'pageStatus.showNoMore': false,
        'pageStatus.showHasMore': false,
        'pageStatus.showRetry': false,
      };
    },
  },
});
