import log from '@/common/log/log';
import pages from '@/common/page/pages';
import stores from '@/stores/index';
import { autorun, observable, toJS } from 'mobx-miniprogram';

Component({
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
  lifetimes: {
    attached: function () {
      this.data.tag = 'category-popup';
      this.disposers = [
        autorun(() => {
          if (!this.data._category || !this.data.category) {
            const { cId } = this.properties.options;
            if (cId) {
              const _category = stores.category.getCategory(cId);
              const _categoryJs = _category && toJS(_category);
              const category = _categoryJs && observable(_categoryJs);
              this.data._category = _category;
              this.data.category = category;
            }
            this.setData({
              _category: this.data._category || {},
              category: this.data.category || observable({}),
            });
            log.info(this.data.tag, 'category-init');
          }
        }),
        autorun(() => {
          if (!this.data._specList || !this.data.specList) {
            const { cId } = this.properties.options;
            if (cId) {
              const _specList = stores.spec.getSpecList(cId);
              const _specListJs = _specList && toJS(_specList);
              const specList = _specListJs && observable(_specListJs);
              this.data._specList = _specList;
              this.data.specList = specList;
            }
            this.setData({
              _specList: this.data._specList || [],
              specList: this.data.specList || observable([]),
            });
            log.info(this.data.tag, 'specList-init');
          }
        }),
      ];
      this.show(this.properties.options);
    },
    detached: function () {
      this.disposers.forEach((disposer) => disposer());
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
