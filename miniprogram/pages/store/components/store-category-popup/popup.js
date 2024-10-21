const { default: log } = require('../../../../common/log/log');

module.exports = Behavior({
  data: {
    storeCategoryPopupEnabled: false,
  },
  methods: {
    _storeCategoryPopupComponent: function () {
      return this.selectComponent('#store-category-popup');
    },
    showCategoryPopup: function (args) {
      this.setData(
        {
          storeCategoryPopupEnabled: true,
        },
        () => {
          const close = args.close;
          args.close = ({ hasChanged, category }) => {
            close?.({ hasChanged, category });
            this.hideCategoryPopup();
          };
          this._storeCategoryPopupComponent().show(args);
        },
      );
    },
    hideCategoryPopup: function () {
      setTimeout(() => {
        this._storeCategoryPopupComponent()?.hide();
        if (this.data.storeCategoryPopupEnabled) {
          this.setData({
            storeCategoryPopupEnabled: false,
          });
        }
      }, 300);
      log.info(this.data.tag, 'hideCategoryPopup');
    },
  },
});
