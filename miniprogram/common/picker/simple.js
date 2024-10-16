import pages from '@/common/page/pages';
import updatePopupProps from '@/common/popup/popup-z-index';

module.exports = Behavior({
  data: {
    simplePicker: {
      visible: false,
      title: '',
      selected: '',
      items: [],
      _items: [],
      _close: () => null,
      _confirm: () => null,
      popupProps: {
        zIndex: pages.zIndexPopup,
        overlayProps: {
          zIndex: pages.zIndexOverlay,
        },
      },
    },
  },
  observers: {
    'simplePicker.visible': function () {
      updatePopupProps({
        tag: 'simplePicker',
        visible: this.data.simplePicker.visible,
        popupProps: this.data.simplePicker.popupProps,
        callback: (popupProps) => {
          this.setData({
            'simplePicker.popupProps': popupProps,
          });
        },
      });
    },
  },
  methods: {
    showSimpePicker: function ({ title, selected, items, close, confirm }) {
      this.setData({
        'simplePicker.visible': true,
        'simplePicker.title': title,
        'simplePicker.items': items,
        'simplePicker._items': items,
        'simplePicker.selected': selected,
        'simplePicker._close': close ?? (() => null),
        'simplePicker._confirm': confirm ?? (() => null),
      });
    },
    hideSimplePicker: function () {
      this.data.simplePicker._close?.();
      this.setData({
        'simplePicker.visible': false,
        'simplePicker.title': '',
        'simplePicker.items': [],
        'simplePicker.selected': '',
        'simplePicker._close': () => null,
      });
      setTimeout(() => {
        // close 在confirm之前执行，需要delay一下
        this.data.simplePicker._items = [];
        this.data.simplePicker._confirm = () => null;
      }, 100);
    },
    _handleSimplePickerConfirm: function (e) {
      const value = e.detail.value[0];
      const item = this.data.simplePicker._items.find((item) => item.value === value);
      if (item != null) {
        this.data.simplePicker._confirm(item);
      }
    },
    _handleSimplePickerClose: function () {
      this.hideSimplePicker();
    },
  },
});
