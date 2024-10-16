import pages from '@/common/page/pages';
import updatePopupProps from '@/common/popup/popup-z-index';

module.exports = Behavior({
  data: {
    simpleActionSheet: {
      visible: false,
      items: [],
      theme: '',
      _selected: () => null,
      _closee: () => null,
      popupProps: {
        zIndex: pages.zIndexPopup,
        overlayProps: {
          zIndex: pages.zIndexOverlay,
        },
      },
    },
  },
  observers: {
    'simpleActionSheet.visible': function () {
      updatePopupProps({
        tag: 'simpleActionSheet',
        visible: this.data.simpleActionSheet.visible,
        popupProps: this.data.simpleActionSheet.popupProps,
        callback: (popupProps) => {
          this.setData({
            'simpleActionSheet.popupProps': popupProps,
          });
        },
      });
    },
  },
  methods: {
    showSimpleActionSheet: function ({ items, selected, close, theme }) {
      this.setData({
        'simpleActionSheet.enabled': true,
        'simpleActionSheet.visible': true,
        'simpleActionSheet.items': items,
        'simpleActionSheet.theme': theme ?? 'list',
        'simpleActionSheet._selected': selected ?? (() => null),
        'simpleActionSheet._close': close ?? (() => null),
      });
    },
    hideSimpleActionSheet: function () {
      this.data.simpleActionSheet._closee?.();
      this.setData({
        'simpleActionSheet.visible': false,
        'simpleActionSheet.items': [],
        'simpleActionSheet._close': () => null,
        'simpleActionSheet._selected': () => null,
      });
      setTimeout(() => {
        this.setData({
          'simpleActionSheet.enabled': false,
        });
      }, 300);
    },
    _handleSimpleActionSheetSelected: function (e) {
      const { selected } = e.detail;
      const { simpleActionSheet: actionSheet } = this.data;
      actionSheet._selected?.(selected.value);
      actionSheet._selected = () => null;
    },
    _handleSimpleActionSheetClose: function () {
      this.hideSimpleActionSheet();
    },
  },
});
