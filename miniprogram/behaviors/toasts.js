import Toast, { hideToast } from 'tdesign-miniprogram/toast/index';

module.exports = Behavior({
  methods: {
    showToastSuccess(msg) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: msg,
        theme: 'success',
        direction: 'column',
      });
    },
    showToastWarning(msg) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: msg,
        theme: 'warning',
        direction: 'column',
      });
    },
    showToastError(msg) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: msg,
        theme: 'error',
        direction: 'column',
      });
    },
    showToastLoading(msg) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: msg,
        duration: -1,
        theme: 'loading',
        direction: 'column',
      });
    },
    hideToast() {
      hideToast({
        context: this,
        selector: '#t-toast',
      });
    },
  },
});
