import log from '@/common/log/log';
import pages from '@/common/page/pages';

module.exports = Behavior({
  data: {
    simplePicker: {
      enabled: false,
      _options: [],
      _close: () => null,
      _confirm: () => null,
    },
  },
  methods: {
    showSimpePicker: function ({
      title,
      selected,
      items,
      cancelBtn = '取消',
      confirmBtn = '确认',
      confirm,
      close,
    }) {
      this.setData({
        'simplePicker.enabled': true,
        'simplePicker._close': close ?? (() => null),
        'simplePicker._confirm': confirm ?? (() => null),
      });
      this._simplePicker((picker, pickerItem) => {
        picker.setData({
          visible: true,
          title: title ?? '',
          value: selected ? [selected] : [],
          cancelBtn: cancelBtn ?? '',
          confirmBtn: confirmBtn ?? '',
          popupProps: {
            zIndex: pages.zIndexIncr(),
            overlayProps: {
              zIndex: pages.zIndex() - 500,
            },
          },
        });
        pickerItem.setData({
          options: items,
        });
      });
    },
    hideSimplePicker: function () {
      this.data.simplePicker._close();
      this._simplePicker((picker, pickerItem) => {
        this.data.simplePicker._options = pickerItem.data.options;
        pickerItem.setData({
          options: [],
        });
        if (picker.data.visible) {
          picker.setData({
            visible: false,
          });
        }
        setTimeout(() => {
          this.setData({
            'simplePicker.enabled': false,
            'simplePicker._options': [],
            'simplePicker._close': () => null,
            'simplePicker._confirm': () => null,
          });
        }, 300);
      });
    },
    _handleSimplePickerConfirm: function (e) {
      const value = e.detail.value[0];
      const { simplePicker } = this.data;
      const item = simplePicker._options.find((item) => item.value === value);
      if (item != null) {
        simplePicker._confirm(item);
      }
    },
    _simplePicker: function (callback) {
      const picker = this.selectComponent('#t-picker');
      const pickerItem = this.selectComponent('#t-picker-item');
      if (picker && pickerItem && callback) {
        callback(picker, pickerItem);
      }
    },
  },
});
