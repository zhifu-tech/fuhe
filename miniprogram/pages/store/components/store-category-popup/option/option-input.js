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
        this._hideOptionAdd();
      }
      if (scene !== 'optionEdit') {
        this._hideOptionEdit();
      }
    },
  },
  methods: {
    onOptionAddClick: function (e) {
      log.info('==========', e);
      const { optionAddSpecId } = this.data;
      const { specId } = e.target.dataset;
      if (optionAddSpecId === specId) {
        this._hideOptionAdd();
      } else {
        this._showOptionAdd(specId);
      }
    },
    onOptionEditClick: function (e) {
      log.info('==========', e);
      const { optionEditSpecId } = this.data;
      const { option } = e.target.dataset;

      if (optionEditSpecId === option.sId) {
        this._hideOptionEdit();
      } else {
        this._showOptionEdit(option);
      }
    },
    _showOptionAdd: function (specId) {
      this.setData({
        showInputScene: 'optionAdd',
        optionAddSpecId: specId,
      });
    },
    _hideOptionAdd: function () {
      const { optionAddSpecId } = this.data;
      if (optionAddSpecId) {
        this.setData({
          optionAddSpecId: null,
        });
      }
    },
    _showOptionEdit: function (option) {
      this.setData({
        optionEditSpecId: option.sId,
        optionEdit: option,
      });
    },
    _hideOptionEdit: function () {
      const { optionEditSpecId, optionEdit } = this.data;
      if (optionEditSpecId || optionEdit) {
        this.setData({
          optionEditSpecId: null,
          optionEdit: null,
        });
      }
    },
  },
});
