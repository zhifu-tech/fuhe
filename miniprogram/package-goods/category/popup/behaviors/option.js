const { default: services } = require('@/services/index');
const { default: log } = require('@/common/log/log');

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
      const infoList = [];
      specs.forEach((spec) => {
        spec.optionList?.forEach((option) => {
          if (option._id.startsWith('-')) {
            infoList.push({
              option,
              sId: spec._id,
              title: option.title,
            });
          }
        });
      });
      if (infoList.length > 0) {
        await services.option.createOptionMany({
          tag,
          infoList,
        });
        log.info(tag, 'handleSpecOptionsAdd');
      }
    },
    handleSpecOptionsUpdate: async function () {
      const { tag, specs, _specs } = this.data;
      const infoList = [];
      specs.forEach((spec) => {
        if (!spec.editable) return;
        if (!spec.optionList || spec.optionList.length === 0) return;
        const src = _specs.find((it) => it._id === spec._id);
        if (!src) return;
        if (spec.optionList == src.optionList) return;
        spec.optionList.forEach((option) => {
          if (!option.editable) return;
          const srcOption = src.optionList.find((it) => it._id === option._id);
          if (srcOption && srcOption.title !== option.title) {
            infoList.push({
              spec,
              sId: spec._id,
              option,
              _id: option._id,
              title: option.title,
            });
          }
        });
      });
      if (infoList.length > 0) {
        await services.option.updateOptionMany({
          tag,
          infoList,
        });
        log.info(tag, 'handleSpecOptionsUpdate');
      }
    },
    handleSpecOptionsDelete: async function () {
      const { tag, category, specs, _specs } = this.data;
      const cId = category._id;
      const list = [];
      _specs.forEach((src) => {
        if (!src.optionList || src.optionList.length === 0) return;
        const dst = specs.find((it) => it._id === src._id);
        // 规格被删除，需要删除所有非本地选项
        if (!dst) {
          src.optionList?.forEach((option) => {
            if (option._id.startsWith('-')) return;
            list.push({ sId: option.sId, oId: option._id });
          });
        }
        // 数据未发生变化，保持不变
        else if (dst.optionList == src.optionList) {
          return;
        } else {
          src.optionList.forEach((srcOption) => {
            const dstOption = dst.optionList.find((it) => it._id === srcOption._id);
            if (!dstOption) {
              list.push({ sId: src._id, oId: srcOption._id });
            }
          });
        }
      });
      if (list.length > 0) {
        const res = await services.option.deleteMany({
          tag,
          cId,
          specOptionIdList: list,
        });
        log.info(tag, 'handleSpecOptionsDelete', res);
      }
    },
  },
});
