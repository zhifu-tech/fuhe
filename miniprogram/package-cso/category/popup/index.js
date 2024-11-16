import log from '@/common/log/log';
import stores from '@/stores/index';
import pages from '@/common/page/pages';
import { observable, toJS } from 'mobx-miniprogram';

Component({
  behaviors: [
    require('miniprogram-computed').behavior, //
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
  watch: {
    options: function (options) {
      log.info(this.data.tag, 'watch observer. function', options);
      const { cId } = this.properties.options;

      const _category = stores.category.getCategory(cId);
      const category = _category && observable(toJS(_category));

      const _specList = stores.spec.getSpecList(cId);
      const specList = _specList && observable(_specList);

      this.setData({
        ...options,

        _category: _category || {},
        category: category || observable({}),

        _specList: _specList || [],
        specList: specList || observable([]),
      });

      this._show();
    },
  },
  methods: {
    _show: function () {
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
      });
    },
    _popup(callback) {
      callback(this.selectComponent('#popup'));
    },
  },
});
