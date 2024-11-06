import log from '@/common/log/log';
import services from '@/services/index';

/** 新增规格 */
module.exports = Behavior({
  data: {
    specsChanged: false,
    specInputVisible: false,
  },
  observers: {
    'specList.length': function (a1) {
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
      const { _specList, specList } = this.data;
      if (_specList.length !== specList.length) return true;
      for (let i = 0; i < specList.length; i++) {
        const a = specList[i];
        const b = _specList[i];
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
    checkSpecEditable: function (specList, spec) {
      if (spec.editable) return spec;
      const editable = { ...spec, editable: true };
      if (editable.optionList) {
        editable.optionList = [...editable.optionList];
      } else {
        editable.optionList = [];
      }
      const index = specList.findIndex((it) => it._id === spec._id);
      if (index === -1) {
        return editable;
      }
      specList[index] = editable;
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
      const { tag, category, specList } = this.data;
      const cId = category._id;
      const list = specList.filter((it) => it._id.startsWith('-'));
      if (list.length > 0) {
        await services.spec.creatSpecList({
          tag,
          cId,
          specList: list,
        });
        log.info(tag, '_handleSpecsAdd', list);
      }
    },
    _handleSpecsUpdate: async function () {
      const { tag, category, specList, _specList } = this.data;
      const cId = category._id;
      const list = specList.filter((spec) => {
        if (!spec.editable) return false;
        const src = _specList.find((it) => it._id === spec._id);
        return src && src.title !== spec.title;
      });
      if (list.length > 0) {
        await services.spec.updateSpecList({
          tag,
          cId,
          specList: list,
        });
        log.info(tag, '_handleSpecsUpdate', list);
      }
    },
    _handleSpecsDelete: async function () {
      const { tag, category, specList, _specList } = this.data;
      const cId = category._id;
      const list = _specList.filter((src) => {
        const dst = specList.find((it) => it._id === src._id);
        return !dst;
      });
      if (list.length > 0) {
        await services.spec.deleteSpecList({
          tag,
          cId,
          specIdList: list.map((it) => it._id),
        });
        log.info(tag, '_handleSpecsDelete', list);
      }
    },
    handleSpecDeleteAll: async function () {
      const { tag, category, _specList } = this.data;
      const cId = category._id;
      const sIds = [];
      const oIds = [];
      _specList.forEach((spec) => {
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
          services.spec.deleteSpecList({
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
