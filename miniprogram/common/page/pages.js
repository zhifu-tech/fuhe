export default {
  currentPage: function () {
    const pages = getCurrentPages();
    return pages[pages.length - 1];
  },
  zIndexToast: 1100500,
  zIndexToastOverlay: 1100000,
  zIndexDialog: 110500,
  zIndexDialogOverlay: 110000,
  zIndexPopup: 11500,
  zIndexOverlay: 11000,
  zIndex: function () {
    const page = this.currentPage();
    const { zIndex } = page?.data;
    if (page && zIndex && zIndex >= 11500) {
      return zIndex;
    } else {
      return 11500;
    }
  },
  zIndexIncr: function () {
    const page = this.currentPage();
    const { zIndex } = page?.data;
    if (page && zIndex && zIndex >= 11500) {
      page.data.zIndex = page.data.zIndex + 1000;
      return page.data.zIndex;
    } else {
      return 11500;
    }
  },
  zIndexDecr: function () {
    const page = this.currentPage();
    const { zIndex } = page?.data;
    if (page && zIndex && zIndex >= 12500) {
      page.data.zIndex = page.data.zIndex - 1000;
      return page.data.zIndex;
    } else {
      return 11500;
    }
  },
};
