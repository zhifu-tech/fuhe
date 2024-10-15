import log from '../../../../../common/log/log';
import services from '../../../../../services/index';

/** 新增规格 */
module.exports = Behavior({
  data: {
    specs: [],
    specsInit: [],
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
      const { specsInit, specs } = this.data;
      if (specsInit.length !== specs.length) return true;
      for (let i = 0; i < specs.length; i++) {
        const a = specs[i];
        const b = specsInit[i];
        if (a == b) continue;
        if (a._id !== b._id) return true;
        if (a.title !== b.title) return true;
        if (a.options == b.options) continue;
        if (a.options && !b.options) return true;
        if (!a.options && b.options) return true;
        if (a.options.length !== b.options.length) return true;
        for (let j = 0; j < a.options.length; j++) {
          const aa = a.options[j];
          const bb = b.options[j];
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
      if (editable.options) {
        editable.options = [...editable.options];
      } else {
        cloned.options = [];
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
      const list = [];
      specs.forEach((spec) => {
        if (spec._id.startsWith('-')) {
          list.push({
            spec,
            title: spec.title,
          });
        }
      });
      if (list.length > 0) {
        const specsRes = await services.spec.crud.createMany({ tag, cId, titles: list });
        list.forEach(({ spec }, index) => {
          const specRes = specsRes[index];
          spec._id = specRes._id;
          spec.cId = specRes.cId;
        });
        this.setHasChanged();
      }
    },
    _handleSpecsUpdate: async function () {
      const { tag, category, specs, specsInit } = this.data;
      const cId = category._id;
      const list = [];
      specs.forEach((spec) => {
        // 更新的必须是clone来的，省去不必要的判定
        if (!spec.editable) return;
        const src = specsInit.find((it) => it._id === spec._id);
        if (src && src.title !== spec.title) {
          list.push({
            spec,
            id: spec._id,
            title: spec.title,
          });
        }
      });
      if (list.length > 0) {
        const res = await services.spec.crud.updateMany({ tag, cId, infoList: list });
        log.info(tag, '_handleSpecsUpdate', res);
        this.setHasChanged();
      }
    },
    _handleSpecsDelete: async function () {
      const { tag, specs, specsInit } = this.data;
      const list = [];
      specsInit.forEach((src) => {
        const dst = specs.find((it) => it._id === src._id);
        if (!dst) list.push(src._id);
      });
      if (list.length > 0) {
        const res = await services.spec.crud.deleteMany({ tag, ids: list });
        log.info(tag, '_handleSpecsDelete', res);
        this.setHasChanged();
      }
    },
    handleSpecDeleteAll: async function () {
      const { tag, specsInit } = this.data;
      const sIds = [];
      const oIds = [];
      specsInit.forEach((spec) => {
        if (spec._id.startsWith('-')) return;
        sIds.push(spec._id);
        spec.options?.forEach((option) => {
          if (option._id.startsWith('-')) return;
          oIds.push({ sId: spec._id, id: option._id });
        });
      });
      if (sIds.length === 0 && oIds.length === 0) {
        return Promise.resolve();
      }
      this.setHasChanged();
      const promises = [];
      if (sIds.length > 0) {
        promises.push(
          services.spec.crud.deleteMany({
            tag,
            ids: sIds,
          }),
        );
      }
      if (oIds.length > 0) {
        promises.push(
          services.spec.crud.deleteOptionMany({
            tag,
            ids: oIds,
          }),
        );
      }
      return Promise.all(promises);
    },
  },
});
