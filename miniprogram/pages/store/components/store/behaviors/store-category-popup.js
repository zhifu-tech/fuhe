import log from '../../../../../utils/log';

module.exports = Behavior({
  data: {
    storeCategoryPopupEnabled: false,
  },
  methods: {
    categoryPopupComponent: function () {
      return this.selectComponent('#store-category-popup');
    },
    showCategoryPopup: function (callback) {
      this.setData(
        {
          storeCategoryPopupEnabled: true,
        },
        () => callback(this.categoryPopupComponent()),
      );
    },
    hideCategoryPopup: function (delayTimeMs = 500) {
      const doHide = () => {
        const popup = this.categoryPopupComponent();
        if (popup.data.visible) {
          // 弹窗仍然展示，需要关闭, 下次回调处理
          popup.hidePopup();
        } else {
          this.setData({
            storeCategoryPopupEnabled: false,
          });
        }
      };
      if (delayTimeMs && delayTimeMs > 0) {
        setTimeout(doHide, delayTimeMs);
      } else {
        doHide();
      }
    },
    onCategoryPopupClose: function (e) {
      const { hasChanged } = e.detail;
      // 规格数据发生变化，需要重新拉取数据。
      if (hasChanged) {
        this._init();
      }
      this.hideCategoryPopup();
    },
  },
});
