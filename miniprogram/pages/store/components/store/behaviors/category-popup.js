import log from '../../../../../common/log/log';

module.exports = Behavior({
  methods: {
    onCategoryPopupClosed: function (e) {
      const { hasChanged, category } = e.detail;
      // 分类相关数据发生变化，需要重新拉取数据。
      if (hasChanged) {
        // if(category.isAdded)
        this._initCategory();
      }
    },
  },
});
