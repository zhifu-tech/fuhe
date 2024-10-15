import log from '../../../../../common/log/log';

module.exports = Behavior({
  behaviors: [require('../../store-category-popup/popup')],
  data: {
    storeCategoryPopupEnabled: false,
  },
  methods: {
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
