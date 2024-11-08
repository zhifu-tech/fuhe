import pages from '@/common/page/pages';

module.exports = Behavior({
  data: {
    simpleActionSheet: {
      enabled: false,
      _selected: () => null,
      _close: () => null,
    },
  },
  methods: {
    showSimpleActionSheet: function ({ items, theme = 'list', }) {
      this.setData({
        'simpleActionSheet.enabled': true,
        'simpleActionSheet._selected': (value) => {
          items.find((item) => item.value === value).selectedFn();
        },
      });
      this._simpleActionSheet((actionSheet) => {
        actionSheet.setData({
          items,
          theme,
          visible: true,
          popupProps: {
            zIndex: pages.zIndexIncr(),
            overlayProps: {
              zIndex: pages.zIndexOverlay(),
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
            visible: false
          });
        }
        setTimeout(() => {
          actionSheet.setData({
            items: [],
          });
          this.setData({
            'simpleActionSheet.enabled': false,
            'simpleActionSheet._selected': () => null,
          });
        }, 500);
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
