const { saasId } = require('@/common/saas/saas');

Component({
  options: {
    virtualHost: true,
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
    hasChanged: false,
    close: () => null,
  },
  observers: {
    visible: function () {
      if (!this.data.visible) {
        this._close();
        this.setData({
          saasId: null,
          hasChanged: false,
          close: () => null,
        });
      }
    },
  },
  methods: {
    show: function ({ category, specs, close }) {
      this.setData({
        visible: true,
        saasId: saasId(),
        category: category ? { ...category } : {}, // 需要浅拷贝，可以修改
        categoryInit: category ?? {}, // 记录原始信息，不可修改
        specs: specs ? [...specs] : [], // 需要浅拷贝，可以修改
        specsInit: specs ?? [], // 记录原始信息，不可修改
        hasChanged: false,
        close: close ?? (() => null),
      });
    },
    hide: function () {
      this.setData({
        visible: false,
      });
    },
    _close: function () {
      const { hasChanged, category } = this.data;
      this.data.close({ hasChanged, category });
      this.triggerEvent('close', {
        hasChanged,
        category,
      });
    },
    setHasChanged() {
      this.setData({
        hasChanged: true,
      });
    },
  },
});
