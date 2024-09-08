import log from '../../../../../utils/log';

module.exports = Behavior({
  data: {
    title: null,
    comfirmDisabled: true,
  },
  observers: {
    'category.title': function () {
      const { category, categoryInit } = this.data;
      const title =
        category.title && category.title.length > 0
          ? category.title
          : categoryInit._id
          ? '修改分类'
          : '新增分类';
      if (title !== this.data.title) {
        this.setData({
          title,
        });
      }
    },
    'categoryChanged,specsChanged': function () {
      const { categoryChanged, specsChanged } = this.data;
      const comfirmDisabled = !categoryChanged && !specsChanged;
      if (comfirmDisabled != this.data.comfirmDisabled) {
        this.setData({
          comfirmDisabled,
        });
      }
    },
  },
  methods: {
    onCancelClick: function () {
      this.hidePopup();
    },
    onConfirmClick: async function () {
      const { tag, categoryChanged, specsChanged } = this.data;
      this.showToastLoading('处理中');
      try {
        if (categoryChanged) {
          const result = await this.handleCategoryChanged();
          log.info(tag, 'confirmed', 'category changed!', result);
        }
        if (specsChanged) {
          await this.handleSpecsChanged();
          log.info(tag, 'confirmed', 'specs changed!');
        }
      } catch (error) {
        log.error(tag, 'confirmed', error);
      } finally {
        this.hidePopup();
        this.hideToast();
      }
    },
  },
});
