const { default: log } = require('@/common/log/log');

module.exports = Behavior({
  methods: {
    initOptions: function () {
      // 未指定规格信息，通过推荐指定
      const { spu, sku } = this.data;
      if (!sku.optionList) {
        sku.optionList = this.promoteOptionList(spu);
      }
    },
    handleOptionSelected: function (e) {
      const { tag, sku } = this.data;
      const { option } = e.target.dataset;
      log.info(tag, 'handleOptionSelected', option);
      sku.optionList = sku.optionList || [];
      // 每种规格，只允许选中一个
      const last = sku.optionList.findIndex(({ sId }) => sId === option.sId);
      if (last != -1) {
        sku.optionList.splice(last, 1);
      }
      sku.optionList.push(option);

      this.setData({
        sku,
      });
    },
  },
});
