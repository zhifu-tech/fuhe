import log from '@/common/log/log';
import services from '@/services/index';

/** 新增规格 */
module.exports = Behavior({
  data: {
    specsChanged: false,
    specInputVisible: false,
  },
  observers: {
    'specs.length': function (a1) {
      const changed = this.checkSpecsChanged();
      if (this.data.specsChanged !== changed) {
        this.setData({
          specsChanged: changed,
        });
      }
    },
  },
  methods: {
    checkSpecsChanged: function () {
      const { _specs, specs } = this.data;
      if (_specs.length !== specs.length) return true;
      for (let i = 0; i < specs.length; i++) {
        const a = specs[i];
        const b = _specs[i];
        if (a == b) continue;
        if (a._id !== b._id) return true;
        if (a.title !== b.title) return true;
        if (a.optionList == b.optionList) continue;
        if (a.optionList && !b.optionList) return true;
        if (!a.optionList && b.optionList) return true;
        if (a.optionList.length !== b.optionList.length) return true;
        for (let j = 0; j < a.optionList.length; j++) {
          const aa = a.optionList[j];
          const bb = b.optionList[j];
          if (aa == bb) continue;
          if (aa._id !== bb._id) return true;
          if (aa.title !== bb.title) return true;
        }
      }
      return false;
    },
    checkSpecEditable: function (specs, spec) {
      if (spec.editable) return spec;
      const editable = { ...spec, editable: true };
      if (editable.optionList) {
        editable.optionList = [...editable.optionList];
      } else {
        editable.optionList = [];
      }
      const index = specs.findIndex((it) => it._id === spec._id);
      if (index === -1) {
        return editable;
      }
      specs[index] = editable;
      return editable;
    },

    handleSpecsChanged: async function () {
      await Promise.all([
        // 1. 规格：新增
        this._handleSpecsAdd(),
        // 2. 规格：变化
        this._handleSpecsUpdate(),
        // 3. 规格：删除
        this._handleSpecsDelete(),
      ]);
      await Promise.all([
        // 1. 选项：新增
        this.handleSpecOptionsAdd(),
        // 2. 选项：变化
        this.handleSpecOptionsUpdate(),
        // 3. 选项：删除
        this.handleSpecOptionsDelete(),
      ]);
    },
    _handleSpecsAdd: async function () {
      const { tag, category, specs } = this.data;
      const cId = category._id;
      const specList = specs.filter((it) => it._id.startsWith('-'));
      if (specList.length > 0) {
        await services.spec.creatSpecMany({ tag, cId, specList });
        log.info(tag, '_handleSpecsAdd', specList);
      }
    },
    _handleSpecsUpdate: async function () {
      const { tag, category, specs, _specs } = this.data;
      const cId = category._id;
      const specList = specs.filter((spec) => {
        if (!spec.editable) return false;
        const src = _specs.find((it) => it._id === spec._id);
        return src && src.title !== spec.title;
      });
      if (specList.length > 0) {
        await services.spec.updateSpecMany({ tag, cId, specList });
        log.info(tag, '_handleSpecsUpdate', specList);
      }
    },
    _handleSpecsDelete: async function () {
      const { tag, category, specs, _specs } = this.data;
      const cId = category._id;
      const specList = _specs.filter((src) => {
        const dst = specs.find((it) => it._id === src._id);
        return !dst;
      });
      if (specList.length > 0) {
        await services.spec.deleteSpecMany({
          tag,
          cId,
          specIdList: specList.map((it) => it._id),
        });
        log.info(tag, '_handleSpecsDelete', specList);
      }
    },
    handleSpecDeleteAll: async function () {
      const { tag, category, _specs } = this.data;
      const cId = category._id;
      const sIds = [];
      const oIds = [];
      _specs.forEach((spec) => {
        if (spec._id.startsWith('-')) return;
        sIds.push(spec._id);
        spec.optionList?.forEach((option) => {
          if (option._id.startsWith('-')) return;
          oIds.push({ sId: spec._id, oId: option._id });
        });
      });
      if (sIds.length === 0 && oIds.length === 0) {
        return Promise.resolve();
      }
      const promises = [];
      if (sIds.length > 0) {
        promises.push(
          services.spec.deleteSpecMany({
            tag,
            cId,
            specIdList: sIds,
          }),
        );
      }
      if (oIds.length > 0) {
        promises.push(
          services.option.deleteOptionMany({
            tag,
            cId,
            specOptionIdList: oIds,
          }),
        );
      }
      return Promise.all(promises);
    },
  },
});
