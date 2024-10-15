const debug = require('../../../../common/debug/debug');
const { default: log } = require('../../../../common/log/log');

Component({
  behaviors: [
    require('../../../../common/popup/popup-props'),
    debug.behaviors({
      tag: 'store-picker',
      debug: true,
      debugLifecycle: true,
    }),
  ],
  options: {
    virtualHost: true,
  },
  data: {
    tag: 'store-picker',
    visible: false,
    selected: '',
    items: [],
    close: () => null,
    confirm: () => null,
  },
  methods: {
    show: function ({ selected, items, close, confirm }) {
      this.setData({
        visible: true,
        selected,
        items,
        close: close ?? (() => null),
        confirm: confirm ?? (() => null),
      });
    },
    hide: function () {
      if (this.data.visible) {
        this.setData({
          visible: false,
        });
      }
    },
    _confirm: function (e) {
      this.data.confirm(e);
    },
    _close: function (e) {
      // 关闭时，1.隐藏弹窗，
      this.hide();
      // 2. 通知外部关闭 store-picker
      this.data.close();
      // 3. 延迟重置数据
      setTimeout(() => {
        this.setData({
          visible: false,
          selected: '',
          items: [],
          close: () => null,
          confirm: () => null,
        });
      }, 250);
    },
  },
});
