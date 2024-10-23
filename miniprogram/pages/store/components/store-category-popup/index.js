const { saasId } = require('@/common/saas/saas');
const { default: log } = require('@/common/log/log');
const { default: pages } = require('../../../../common/page/pages');

Component({
  options: {
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  behaviors: [
    require('./behaviors/header'),
    require('./behaviors/category'),
    require('./behaviors/category-delete'),
    require('./behaviors/category-input'),
    require('./behaviors/category-input-action'),
    require('./behaviors/spec'),
    require('./behaviors/spec-delete'),
    require('./behaviors/spec-input'),
    require('./behaviors/spec-input-action'),
    require('./behaviors/option'),
    require('./behaviors/option-delete'),
    require('./behaviors/option-input'),
    require('./behaviors/option-input-action'),
  ],
  data: {
    tag: 'category-popup',
    saasId: '',
    _hasChanged: false,
    _close: () => null,
  },
  methods: {
    show: function ({ category, specs, close }) {
      this.setData({
        saasId: saasId(),
        _category: category ?? {}, // 记录原始信息，不可修改
        category: category ? { ...category } : {}, // 需要浅拷贝，可以修改
        _specs: specs ?? [], // 记录原始信息，不可修改
        specs: specs ? [...specs] : [], // 需要浅拷贝，可以修改
        _hasChanged: false,
        _close: close ?? (() => null),
      });
      this._popup((popup) => {
        popup.setData({
          visible: true,
          zIndex: pages.zIndexIncr(),
          overlayProps: {
            zIndex: pages.zIndexOverlay(),
          },
        });
      });
    },
    hide: function () {
      this._popup((popup) => {
        if (popup.data.visible) {
          popup.setData({
            visible: false,
          });
        }
        const { _close, _hasChanged, _category } = this.data;
        _close({
          hasChanged: _hasChanged,
          category: _category,
        });
        this.setData({
          category: {},
          _category: {},
          specs: [],
          _specs: [],
          saasId: null,
          _hasChanged: false,
          _close: () => null,
        });
      });
    },
    setHasChanged() {
      this.data._hasChanged = true;
    },
    _popup(callback) {
      callback(this.selectComponent('#category-popup'));
    },
  },
});
