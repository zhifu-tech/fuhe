export default (function () {
  const _zIndex = 11500;
  return {
    currentPage: function () {
      const pages = getCurrentPages();
      return pages.length > 0 ? pages[pages.length - 1] : null;
    },
    zIndex: function () {
      const page = this.currentPage() || {};
      page.data.zIndex = page.data.zIndex || _zIndex;
      return page.data.zIndex;
    },
    zIndexOverlay: function () {
      return this.zIndex() - 500;
    },
    zIndexIncr: function () {
      const page = this.currentPage() || {};
      page.data.zIndex = page.data.zIndex || _zIndex;
      page.data.zIndex = page.data.zIndex + 1000;
      return page.data.zIndex;
    },
    zIndexDecr: function () {
      const page = this.currentPage() || {};
      page.data.zIndex = page.data.zIndex || _zIndex;
      if (page.data.zIndex >= _zIndex + 1000) {
        page.data.zIndex = page.data.zIndex - 1000;
      }
      return page.data.zIndex;
    },
  };
})();
