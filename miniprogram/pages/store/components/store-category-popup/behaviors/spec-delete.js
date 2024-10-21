import log from '@/common/log/log';
import { showToastSuccess, showToastError } from '@/common/toast/simples.js';
import { showConfirmDialog } from '@/common/dialog/simples.js';

module.exports = Behavior({
  methods: {
    onSpecDeleteClick: function (e) {
      const { tag } = this.data;
      const { spec } = e.target.dataset;
      showConfirmDialog({
        title: '是否确认删除',
        content: `如果存在与规格「${spec.title}」关联的作品，将导致规格不可用！`,
        confirmBtn: '确认删除',
        cancelBtn: '取消',
        confirm: () => this._deleteSpec(spec),
        cancel: (error) => {
          log.info(tag, 'spec-delete', 'cancel', error);
          if (error) {
            showToastError({ message: '删除失败！' });
          }
        },
      });
    },
    _deleteSpec: async function (spec) {
      const { tag, specs } = this.data;
      const index = specs.findIndex((it) => it._id === spec._id);
      if (index != -1) {
        specs.splice(index, 1);
        this.setData({
          specs,
        });
      } else {
        log.info(tag, 'spec-delete', `不存在删除的 ${spec}`);
      }
      showToastSuccess({ message: '删除成功！' });
      this.setData({
        specs,
      });
    },
  },
});
