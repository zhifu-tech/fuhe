import log from '../../../../utils/log';

Component({
  options: {
    virtualHost: true,
  },
  externalClasses: ['input-class'],
  properties: {
    label: {
      type: String,
      value: '',
    },
    tips: {
      type: String,
      value: '',
    },
    value: {
      type: String,
      value: '',
    },
    action: {
      type: String,
      value: '',
    },
    actionDisabled: {
      type: Boolean,
      value: true,
    },
    actionResponse: {
      type: Object,
      value: {},
    },
  },
  data: {
    tag: 'store-input',
  },
  observers: {
    actionResponse: function (res) {
      log.info('store-input', 'actionResponse', res);
      this.onActionResult(res);
    },
  },
  methods: {
    onChange(e) {
      const value = e.detail.value || '';
      this.data.value = value;
      this._setActionDisabled(value.length === 0);
    },
    onClear() {
      this._setActionDisabled(true);
      this.data.value = '';
    },
    onBlur(e) {
      const value = e.detail.value || '';
      this.data.value = value;
    },
    onAction() {
      const { tag, actionDisabled } = this.data;
      if (actionDisabled) {
        log.info(tag, 'action is disabled, and action triggered by enter');
        return;
      }
      this.triggerEvent('action', {
        value: this.data.value || '',
      });
    },
    onActionResult({ result, reason, post, keep }) {
      if (keep) {
        // do nothing.
        result;
      }
      if (result === 'ok') {
        if (post) {
          this.setData({
            value: post.value || '',
            action: post.action || '',
            actionDisabled: true,
          });
        } else {
          this.setData({
            value: '',
            actionDisabled: true,
          });
        }
      } else if (result === 'fail') {
        wx.showToast({
          title: reason,
        });
      }
    },
    _setActionDisabled(disabled) {
      const { action, actionDisabled } = this.data;
      if (action.length === 0) {
        return;
      }
      if (disabled !== actionDisabled) {
        this.setData({
          actionDisabled: disabled,
        });
      }
    },
  },
});
