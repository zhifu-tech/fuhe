module.exports = Behavior({
  data: {
    showSpecList: false, // 是否展示规格列表
    optionList: null, // 选中的选项信息
    optionListNeedReset: false,
  },
  observers: {
    sku: function (sku) {
      if (this.data.optionList === null) {
        sku.optionList = sku.optionList || [];
        this.setData({
          optionList: [...this.data.sku.optionList],
        });
      }
    },
  },
  methods: {
    handleShowSpecList: function () {
      const showSpecList = !this.data.showSpecList;
      this.setData({
        showSpecList: showSpecList,
      });
      if (!showSpecList && this.data.optionListNeedReset) {
        this.setData({
          optionList: [...this.data.sku.optionList],
          optionListNeedReset: false,
        });
      }
    },
    handleOptionSelected: function (e) {
      const { option } = e.target.dataset;
      const { tag, optionList } = this.data;

      // 每种规格，只允许选中一个
      const last = optionList.findIndex(({ sId }) => sId === option.sId);
      if (last != -1) {
        optionList[last] = option;
      } else {
        optionList.push(option);
      }
      this.setData({
        optionList,
      });
      // 找到包含optionList的sku
      const { spu } = this.data;
      const { skuList } = spu;
      const nextSku = skuList.find((nextSku) =>
        nextSku.optionList.every((option, index) => option._id === optionList[index]._id),
      );
      if (nextSku) {
        this.data.optionListNeedReset = false;
        this.setData({
          sku: nextSku,
        });
      } else {
        this.data.optionListNeedReset = true;
        this.showSkuAddDialog({
          msg: optionList.map((it) => it.title).join(','),
          optionList,
          spu,
        });
      }
    },
  },
});
