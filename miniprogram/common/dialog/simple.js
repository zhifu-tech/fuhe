import pages from '@/common/page/pages';
import log from '@/common/log/log';

module.exports = Behavior({
  data: {
    simpleDialog: {
      enabled: false,
    },
  },
  methods: {
    showSimpleDialog: function ({ options, confirm, cancel, action }) {
      this.setData({
        'simpleDialog.enabled': true,
      });
      this._simpleDialog((dialog) => {
        dialog.setData({
          ...options,
          visible: true,
          zIndex: pages.zIndexIncr(),
          overlayProps: {
            zIndex: pages.zIndexOverlay(),
          },
        });
        dialog._onConfirm = confirm;
        dialog._onCancel = cancel;
        dialog._onAction = action;
      });
    },
    hideSimpleDialog: function () {
      log.info('simpleDialog', 'hide');
      this._simpleDialog((dialog) => {
        if (dialog.data.visible) {
          dialog.setData({
            visible: false,
          });
        }
        setTimeout(() => {
          this.setData({
            'simpleDialog.enabled': false,
          });
          dialog._onConfirm = null;
          dialog._onCancel = null;
          dialog._onAction = null;
        }, 300);
      });
    },
    _simpleDialog: function (callback) {
      const dialog = this.selectComponent('#t-dialog');
      if (dialog) {
        callback && callback(dialog);
      }
    },
  },
});
