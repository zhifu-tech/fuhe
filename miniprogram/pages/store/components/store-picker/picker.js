const { default: log } = require('../../../../common/log/log');

module.exports = Behavior({
  data: {
    storePickerEnabled: false,
  },
  methods: {
    _storePickerComponent: function () {
      return this.selectComponent('#store-picker');
    },
    showPicker: function (args) {
      this.setData(
        {
          storePickerEnabled: true,
        },
        () => {
          args.close = this.hidePicker.bind(this);
          this._storePickerComponent().show(args);
        },
      );
    },
    hidePicker: function () {
      setTimeout(() => {
        this._storePickerComponent()?.hide();
        if (this.data.storePickerEnabled) {
          this.setData({
            storePickerEnabled: false,
          });
        }
        log.info('storePicker', 'hidePicker');
      }, 300);
    },
  },
});
