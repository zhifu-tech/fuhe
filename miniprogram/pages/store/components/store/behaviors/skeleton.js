const { default: pages } = require('@/common/page/pages');

module.exports = Behavior({
  methods: {
    hideSkeleton: function () {
      pages.currentPage().setData({
        showSkeleton: false,
      });
    },
  },
});
