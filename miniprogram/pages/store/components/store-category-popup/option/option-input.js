import log from '../../../../../utils/log';

module.exports = Behavior({
  data: {
    optionAddSpecId: null, // 展示「新增选项」输入的Spec
    optionEditSpecId: null, // 展示「编辑选项」输入的Spec
    optionEdit: null, // 展示「编辑选项」输入的Option
  },
  observers: {
    showInputScene: function (scene) {
      if (scene !== 'optionAdd') {
        this.hideOptionAdd();
      }
      if (scene !== 'optionEdit') {
        this.hideOptionEdit();
      }
    },
  },
  methods: {
    onOptionAddClick: function (e) {
      const { tag, optionAddSpecId } = this.data;
      const { specId } = e.target.dataset;
      log.info(tag, 'onOptionAddClick', specId, optionAddSpecId);
      if (optionAddSpecId === specId) {
        this.hideOptionAdd();
      } else {
        this.showOptionAdd(specId);
      }
    },
    onOptionEditClick: function (e) {
      const { optionEditSpecId } = this.data;
      const { option } = e.target.dataset;
      if (optionEditSpecId === option.sId) {
        this.hideOptionEdit();
      } else {
        this.showOptionEdit(option);
      }
    },
    showOptionAdd: function (specId) {
      this.setData({
        showInputScene: 'optionAdd',
        optionAddSpecId: specId,
      });
    },
    hideOptionAdd: function () {
      const { optionAddSpecId } = this.data;
      if (optionAddSpecId) {
        this.setData({
          optionAddSpecId: null,
        });
      }
    },
    showOptionEdit: function (option) {
      const { tag } = this.data;
      log.info(tag, 'showOptionEdit', option, this.data.optionEdit);
      this.setData({
        showInputScene: 'optionEdit',
        optionEditSpecId: option.sId,
        optionEdit: option,
      });
    },
    hideOptionEdit: function () {
      const { tag, optionEditSpecId, optionEdit } = this.data;
      if (optionEditSpecId || optionEdit) {
        log.info(tag, 'hideOptionEdit', this.data.optionEdit);
        this.setData({
          optionEditSpecId: null,
          optionEdit: null,
        });
      }
    },
  },
});
