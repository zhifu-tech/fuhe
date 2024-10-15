import ActionSheet, { ActionSheetTheme } from 'tdesign-miniprogram/action-sheet/index';
import log from '../log/log';
import pages from '../page/pages';

module.exports = Behavior({
  data: {
    actionSheet: {
      enabled: false,
      _selected: () => null,
      _closee: () => null,
    },
    actionSheetEnabled: false,
  },
  methods: {
    showActionSheet: function (args) {
      this.setData(
        {
          'actionSheet.enabled': true,
        },
        () => {
          const { actionSheet: as } = this.data;
          as._close = args._close;
          as._selected = args.selected;

          ActionSheet.show({
            theme: ActionSheetTheme.List,
            selector: '#t-action-sheet',
            context: this,
            ...args,
            popupProps: {
              zIndex: pages.zIndexDialog,
              overlayProps: {
                zIndex: pages.zIndexDialogOverlay,
              },
            },
          });
        },
      );
    },
    handleActionSheetSelected: function (e) {
      const { selected } = e.detail;
      const { actionSheet } = this.data;
      actionSheet._selected?.(selected.value);
      actionSheet._selected = () => null;
    },
    handleActionSheetClose: function (e) {
      const { actionSheet } = this.data;
      actionSheet._closee?.(e);
      actionSheet._closee = () => null;
      setTimeout(() => {
        this.setData({
          'actionSheet.enabled': false,
        });
      }, 200);
    },
  },
});
