import Dialog from 'tdesign-miniprogram/dialog/index';
import log from '../../../../../common/log/log';

import { showToastSuccess, showToastError } from '../../../../../common/toast/simples.js';

module.exports = Behavior({
  methods: {
    onOptionDelete: function (e) {
      const { option } = e.target.dataset;
      const { tag } = this.data;
      log.info(tag, 'option-action-delete', e, option);
      Dialog.confirm({
        context: this,
        title: '是否确认删除',
        content: `如果存在与规格「${option.title}」关联的作品，将不可用！`,
        confirmBtn: '确认删除',
        cancelBtn: '取消',
      })
        .then(() => this._deleteSepcOption(option))
        .catch((error) => {
          log.info(tag, 'category-delte', 'cancel', error);
          if (error) {
            showToastError({ message: '删除失败！' });
          }
        });
    },
    _deleteSepcOption: function (option) {
      const { specs } = this.data;
      let spec = specs.find((it) => it._id === option.sId);
      const index = spec?.options?.findIndex((it) => it._id === option._id) ?? -1;
      if (index !== -1) {
        spec = this.checkSpecEditable(specs, spec);
        spec.options.splice(index, 1);
        this.setData({
          specs,
        });
        showToastSuccess({ message: '删除成功！' });
      } else {
        showToastError({ message: '删除失败!' });
      }
    },
  },
});
