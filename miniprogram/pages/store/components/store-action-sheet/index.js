const debug = require('../../../../common/debug/debug');
const { default: log } = require('../../../../common/log/log');

Component({
  options: {
    virtualHost: true,
    pureDataPattern: /^_/, // 指定所有 _ 开头的数据字段为纯数据字段
  },
  behaviors: [
    require('../../../../common/popup/popup-props'),
    debug.behaviors({
      tag: 'store-action-sheet',
      debug: true,
      debugLifecycle: true,
    }),
  ],
  options: {
    virtualHost: true,
  },
  data: {
    tag: 'store-action-sheet',
    visible: false,
    selected: '',
    items: [],
    close: () => null,
    selected: () => null,
  },
  methods: {
    show: function ({ items, close, selected }) {
      this.setData({
        visible: true,
        selected,
        items,
        close: close ?? (() => null),
        selected: selected ?? (() => null),
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
