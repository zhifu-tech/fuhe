import log from '@/common/log/log';
import { showToastLoading, hideToastLoading, showToastError } from '@/common/toast/simples';

module.exports = Behavior({
  data: {
    title: null,
    comfirmDisabled: true,
  },
  observers: {
    'category.title': function () {
      const { category, _category } = this.data;
      const title =
        category.title && category.title.length > 0
          ? category.title
          : _category._id
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
      this.hide();
    },
    onConfirmClick: async function () {
      const { tag, categoryChanged, specsChanged } = this.data;
      showToastLoading({ message: '处理中' });
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
        showToastError({});
      } finally {
        this.hide();
        hideToastLoading();
      }
    },
  },
});
