const { default: services } = require('../../../../../services/index');
const { default: log } = require('../../../../../utils/log');

module.exports = Behavior({
  methods: {
    checkOptionEditable: function (options, option) {
      if (option.editable) return option;
      const editable = { ...option, editable: true };
      const index = options.findIndex((it) => it._id === option._id);
      if (index === -1) {
        return editable;
      }
      options[index] = editable;
      return editable;
    },
    handleSpecOptionsAdd: async function () {
      const { tag, specs } = this.data;
      const list = [];
      specs.forEach((spec) => {
        spec.options?.forEach(({ _id, title }) => {
          if (_id.startsWith('-')) {
            list.push({ spec, sId: spec._id, title });
          }
        });
      });
      if (list.length > 0) {
        const res = await services.spec.crud.createOptionMany({
          tag,
          infoList: list,
        });
        list.forEach(({ spec }, index) => {
          spec._id = res[index]._id;
        });
        log.info(tag, 'handleSpecOptionsAdd', res);
        this.setHasChanged();
      }
    },
    handleSpecOptionsUpdate: async function () {
      const { tag, specs, specsInit } = this.data;
      const list = [];
      specs.forEach((spec) => {
        // 更新的必须是clone来的，省去不必要的判定
        if (!spec.editable) return;
        if (!spec.options || spec.options.length === 0) return;
        const src = specsInit.find((it) => it._id === spec._id);
        if (!src) return;
        if (spec.options == src.options) return;
        spec.options.forEach((option) => {
          if (!option.editable) return;
          const srcOption = src.options.find((it) => it._id === option._id);
          if (srcOption && srcOption.title !== option.title) {
            list.push({ spec, sId: spec._id, option, id: option._id, title: option.title });
          }
        });
      });
      if (list.length > 0) {
        const res = await services.spec.crud.updateOptionsMany({
          tag,
          infoList: list,
        });
        log.info(tag, 'handleSpecOptionsUpdate', res);
        this.setHasChanged();
      }
    },
    handleSpecOptionsDelete: async function () {
      const { tag, specs, specsInit } = this.data;
      const list = [];
      specsInit.forEach((src) => {
        if (!src.options || src.options.length === 0) return;
        const dst = specs.find((it) => it._id === src._id);
        // 规格被删除，需要删除所有非本地选项
        if (!dst) {
          src.options?.forEach((option) => {
            if (option._id.startsWith('-')) return;
            list.push({ sId: option.sId, id: option._id });
          });
        }
        // 数据未发生变化，保持不变
        else if (dst.options == src.options) {
          return;
        } else {
          src.options.forEach((srcOption) => {
            const dstOption = dst.options.find((it) => it._id === srcOption._id);
            if (!dstOption) {
              list.push({ sId: src._id, id: srcOption._id });
            }
          });
        }
      });
      if (list.length > 0) {
        const res = await services.spec.crud.deleteOptionMany({
          tag,
          ids: list,
        });
        log.info(tag, 'handleSpecOptionsDelete', res);
        this.setHasChanged();
      }
    },
  },
});
