const { default: services } = require('@/services/index');
const { default: log } = require('@/common/log/log');

module.exports = Behavior({
  methods: {
    checkOptionEditable: function (optionList, option) {
      if (option.editable) return option;
      const editable = { ...option, editable: true };
      const index = optionList.findIndex((it) => it._id === option._id);
      if (index === -1) {
        log.info(tag, 'handleSpecOptionsAdd', 'optionList not found');
        return editable;
      }
      optionList[index] = editable;
      return editable;
    },
    handleSpecOptionsAdd: async function () {
      const {
        tag,
        category: { _id: cId },
        specList,
      } = this.data;

      const infoList = [];
      specList.forEach((spec) => {
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
          cId,
          infoList,
        });
        log.info(tag, 'handleSpecOptionsAdd');
      }
    },
    handleSpecOptionsUpdate: async function () {
      const {
        tag,
        category: { _id: cId },
        specList,
        _specList,
      } = this.data;

      const infoList = [];
      specList.forEach((spec) => {
        if (!spec.editable) return;
        if (!spec.optionList || spec.optionList.length === 0) return;
        const src = _specList.find((it) => it._id === spec._id);
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
          cId,
          infoList,
        });
        log.info(tag, 'handleSpecOptionsUpdate');
      }
    },
    handleSpecOptionsDelete: async function () {
      const {
        tag,
        category: { _id: cId },
        specList,
        _specList,
      } = this.data;
      const infoList = [];
      _specList.forEach((src) => {
        if (!src.optionList || src.optionList.length === 0) return;
        const dst = specList.find((it) => it._id === src._id);
        if (!dst) {
          // 规格被删除，需要删除所有非本地选项
          src.optionList?.forEach((option) => {
            if (option._id.startsWith('-')) return;
            infoList.push({
              option,
              sId: option.sId,
              _id: option._id,
            });
          });
        } else if (dst.optionList == src.optionList) {
          // 数据未发生变化，保持不变
          return;
        } else {
          src.optionList.forEach((srcOption) => {
            const dstOption = dst.optionList.find((it) => it._id === srcOption._id);
            if (!dstOption) {
              infoList.push({
                option: srcOption,
                sId: src._id,
                _id: srcOption._id,
              });
            }
          });
        }
      });
      if (infoList.length > 0) {
        await services.option.deleteOptionMany({
          tag,
          cId,
          infoList,
        });
        log.info(tag, 'handleSpecOptionsDelete');
      }
    },
  },
});
