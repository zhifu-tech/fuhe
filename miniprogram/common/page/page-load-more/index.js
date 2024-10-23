Component({
  options: {
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  properties: {
    showLoading: {
      type: Boolean,
      value: false,
    },
    showNoMore: {
      type: Boolean,
      value: false,
    },
    showHasMore: {
      type: Boolean,
      value: false,
    },
    showRetry: {
      type: Boolean,
      value: false,
    },

    loadingText: {
      type: String,
      value: '加载中...',
    },
    hasMoreText: {
      type: String,
      value: '加载更多',
    },
    noMoreText: {
      type: String,
      value: '没有更多了',
    },
    retryText: {
      type: String,
      value: '加载失败，点击重试',
    },
  },

  methods: {
    handleLoadMoreAction: function () {
      const { showHasMore, showRetry } = this.data;
      if (showRetry) {
        this.triggerEvent('retry');
      } else if (showHasMore) {
        this.triggerEvent('more');
      }
    },
  },
});
