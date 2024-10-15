import Toast, { hideToast } from 'tdesign-miniprogram/toast/index';
import pages from '../page/pages';

module.exports = Behavior({
  methods: {
    showToastSuccess(msg) {
      Toast({
        message: msg,
        theme: 'success',
        ...this._commonToastProps(),
      });
    },
    showToastWarning(msg) {
      Toast({
        message: msg,
        theme: 'warning',
        ...this._commonToastProps(),
      });
    },
    showToastError(msg) {
      Toast({
        theme: 'error',
        message: msg,
        ...this._commonToastProps(),
      });
    },
    showToastLoading(msg) {
      Toast({
        theme: 'loading',
        message: msg,
        duration: -1,
        ...this._commonToastProps(),
      });
    },
    hideToast() {
      hideToast(this._commonToastProps());
    },
    _commonToastProps: function () {
      return {
        context: pages.currentPage().store(),
        selector: '#t-toast',
        style: `z-index:${pages.zIndexToast}`,
        direction: 'column',
      };
    },
  },
});
