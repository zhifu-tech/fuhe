import log from '@/common/log/log';
import { showToastSuccess, showToastError } from '@/common/toast/simples.js';
import { showConfirmDialog } from '@/common/dialog/simples.js';

module.exports = Behavior({
  methods: {
    onOptionDelete: function (e) {
      const { option } = e.target.dataset;
      const { tag } = this.data;
      showConfirmDialog({
        title: '是否确认删除',
        content: `如果存在与规格「${option.title}」关联的商品，将不可用！`,
        confirmBtn: '确认删除',
        cancelBtn: '取消',
        confirm: () => {
          log.info(tag, 'category-delte', 'confirm', option);
          this._deleteSepcOption(option);
        },
        cancel: (error) => {
          log.info(tag, 'category-delte', 'cancel', error);
          if (error) {
            showToastError({ message: '删除失败！' });
          }
        },
      });
    },
    _deleteSepcOption: function (option) {
      const { specList } = this.data;
      let spec = specList.find((it) => it._id === option.sId);
      const index = spec?.optionList?.findIndex((it) => it._id === option._id) ?? -1;
      if (index !== -1) {
        spec = this.checkSpecEditable(specList, spec);
        spec.optionList.splice(index, 1);
        this.setData({
          specList,
        });
        showToastSuccess({ message: '删除成功！' });
      } else {
        showToastError({ message: '删除失败!' });
      }
    },
  },
});
