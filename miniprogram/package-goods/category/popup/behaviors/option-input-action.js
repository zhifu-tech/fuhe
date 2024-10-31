import { showToastError } from '@/common/toast/simples.js';
import log from '@/common/log/log';
import services from '@/services/index';

module.exports = Behavior({
  data: {
    optionAddedCount: 0,
  },
  methods: {
    onOptionInputAction: function (e) {
      const { value: title, callback } = e.detail;
      const { specId: sId } = e.target.dataset;
      const { tag, specs, optionEdit } = this.data;
      log.info(tag, 'option', title, e);
      // 查找绑定的spec
      let spec = specs.find((it) => it._id === sId);
      if (!spec) {
        showToastError({ message: '未知错误' });
        log.info(tag, 'option', '未知错误');
        return;
      }
      // 重复性校验
      const dupOption = spec.optionList?.find((it) => it.title === title);
      if (dupOption) {
        showToastError({ message: `已经存在选项 ${title}` });
        log.info(tag, 'option', `已经存在选项 ${title}`);
        return;
      }
      // 校验和clone数据，用来判断是否修改
      spec = this.checkSpecEditable(specs, spec);
      // 编辑选项
      if (optionEdit) {
        let option = spec.optionList.find((it) => it._id === optionEdit._id);
        if (!option) {
          showToastError({ message: '未知错误' });
          log.info(tag, 'option', '未知错误,选项状态错误');
          return;
        }
        option = this.checkOptionEditable(spec.optionList, option);
        option.title = title;
        this.setData({
          specs,
        });
        callback({
          value: '',
          action: '新增选项',
          actionDisabled: true,
        });
        this.showOptionAdd();
        log.info(tag, 'onEditOptionEvent', title, option);
      } else {
        const id = ++this.data.optionAddedCount;
        const added = {
          _id: `-${id}`,
          sId: spec._id,
          title,
        };
        added.editable = true;
        spec.optionList = spec.optionList || [];
        spec.optionList.push(added);
        this.setData({
          specs,
        });
        callback({
          value: '',
        });
        log.info(tag, 'onAddOptionEvent', title, added);
      }
    },
  },
});
