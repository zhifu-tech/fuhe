const { saasId } = require('@/common/saas/saas');

Component({
  options: {
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  behaviors: [
    require('@/common/popup/popup-props'),

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
    visible: false,
    saasId: '',
    _hasChanged: false,
    _close: () => null,
  },
  observers: {
    visible: function () {
      if (!this.data.visible) {
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
      }
    },
  },
  methods: {
    show: function ({ category, specs, close }) {
      this.setData({
        visible: true,
        saasId: saasId(),
        _category: category ?? {}, // 记录原始信息，不可修改
        category: category ? { ...category } : {}, // 需要浅拷贝，可以修改
        _specs: specs ?? [], // 记录原始信息，不可修改
        specs: specs ? [...specs] : [], // 需要浅拷贝，可以修改
        _hasChanged: false,
        _close: close ?? (() => null),
      });
    },
    hide: function () {
      this.setData({
        visible: false,
      });
    },
    setHasChanged() {
      this.data._hasChanged = true;
    },
  },
});
