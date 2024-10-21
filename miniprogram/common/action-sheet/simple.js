import pages from '@/common/page/pages';
import log from '@/common/log/log';

module.exports = Behavior({
  data: {
    simpleActionSheet: {
      enabled: false,
      _selected: () => null,
      _close: () => null,
    },
  },
  methods: {
    showSimpleActionSheet: function ({ options, selected, close }) {
      this.setData({
        'simpleActionSheet.enabled': true,
        'simpleActionSheet._selected': selected ?? (() => null),
        'simpleActionSheet._close': close ?? (() => null),
      });
      this._simpleActionSheet((actionSheet) => {
        actionSheet.setData({
          ...options,
          visible: true,
          popupProps: {
            zIndex: pages.zIndexIncr(),
            overlayProps: {
              zIndex: pages.zIndex() - 500,
            },
          },
        });
      });
    },
    hideSimpleActionSheet: function () {
      this.data.simpleActionSheet._close();
      this._simpleActionSheet((actionSheet) => {
        if (actionSheet.data.visible) {
          actionSheet.setData({
            items: [],
            visible: false,
          });
        }
        setTimeout(() => {
          this.setData({
            'simpleActionSheet.enabled': false,
            'simpleActionSheet._close': () => null,
            'simpleActionSheet._selected': () => null,
          });
        }, 300);
      });
    },
    _handleSimpleActionSheetSelected: function (e) {
      const { selected } = e.detail;
      this.data.simpleActionSheet._selected(selected.value);
    },
    _simpleActionSheet: function (callback) {
      const actionSheet = this.selectComponent('#t-action-sheet');
      if (actionSheet && callback) {
        callback(actionSheet);
      }
    },
  },
});
