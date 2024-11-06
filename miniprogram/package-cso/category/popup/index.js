import log from '@/common/log/log';
import pages from '@/common/page/pages';
import stores from '@/stores/index';
import services from '@/services/index';

Component({
  behaviors: [
    require('mobx-miniprogram-bindings').storeBindingsBehavior,
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
  options: {
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  properties: {
    options: {
      type: Object,
      value: {},
    },
  },
  data: {
    tag: 'category-popup',
  },
  storeBindings: {
    stores,
    fields: {
      _category: function () {
        // 记录原始信息，不可修改
        const { cId } = this.properties.options;
        if (cId) {
          const category = stores.category.getCategory(cId);
          return category || {};
        } else {
          return {};
        }
      },
      category: function () {
        // 为传入数据的拷贝，可以修改，最后提交
        const { cId } = this.properties.options;
        if (cId) {
          const category = stores.category.getCategory(cId) || {};
          return { ...category };
        } else {
          return {};
        }
      },
      _specList: function () {
        // 记录原始信息，不可修改
        const { cId } = this.properties.options;
        if (cId) {
          const specList = stores.spec.getSpecList(cId);
          if (!specList) {
            services.spec.getSpecList({ tag: 'category-popup', cId });
          }
          return specList || [];
        } else {
          return [];
        }
      },
      specList: function () {
        // 为传入数据的拷贝，可以修改，最后提交
        const { cId } = this.properties.options;
        if (cId) {
          const specList = stores.spec.getSpecList(cId) || [];
          return [...specList];
        } else {
          return [];
        }
      },
    },
  },
  observers: {
    options: function (options) {
      if (!options.destroy) {
        this.show(options);
      }
    },
  },
  methods: {
    show: function (options) {
      this.setData({ ...options });
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
        this.data.options?.close?.();
        this.setData({
          options: { destroy: true },
        });
      });
    },
    _popup(callback) {
      callback(this.selectComponent('#popup'));
    },
  },
});
