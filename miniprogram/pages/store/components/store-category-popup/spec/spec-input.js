import log from '../../../../../utils/log';

module.exports = Behavior({
  data: {
    specAddShow: true, // 是否展示「新增规格」输入
    specEditId: null, // 展示「编辑规格」输入的Id
  },
  observers: {
    showInputScene: function (scene) {
      if (scene !== 'specAdd') {
        this._hideSpecAdd();
      }
      if (scene !== 'specEdit') {
        this._hideSpecEdit();
      }
    },
  },
  methods: {
    onSpecAddClick: function (e) {
      if (this.data.specAddShow) {
        this._hideSpecAdd();
      } else {
        this._showSpecAdd();
      }
    },
    onSpecEditClick: function (e) {
      const { specEditId } = this.data;
      const { spec } = e.target.dataset;
      if (specEditId === spec._id) {
        this._hideSpecEdit();
      } else {
        this._showSpecEdit(spec);
      }
    },
    _showSpecAdd: function () {
      this.setData({
        showInputScene: 'specAdd',
        specAddShow: true,
      });
    },
    _hideSpecAdd: function () {
      const { specAddShow } = this.data;
      if (specAddShow) {
        this.setData({
          specAddShow: false,
        });
      }
    },
    _showSpecEdit: function (spec) {
      this.setData({
        showInputScene: 'specEdit',
        specEditId: spec._id,
      });
    },
    _hideSpecEdit: function () {
      const { specEditId } = this.data;
      if (specEditId) {
        this.setData({
          specEditId: null,
        });
      }
    },
  },
});
