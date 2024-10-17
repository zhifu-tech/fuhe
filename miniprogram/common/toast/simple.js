import { showToast, hideToast } from 'tdesign-miniprogram/toast/index';
import pages from '../page/pages';

module.exports = Behavior({
  methods: {
    showSimpleToast: function ({ theme, message, duration }) {
      showToast({
        message,
        duration,
        theme,
        context: this,
        selector: '#t-toast',
        style: `z-index:${pages.zIndexToast}`,
        direction: 'column',
      });
    },
    hideSimpleToast: function () {
      hideToast({
        context: this,
        selector: '#t-toast',
      });
    },
  },
});
