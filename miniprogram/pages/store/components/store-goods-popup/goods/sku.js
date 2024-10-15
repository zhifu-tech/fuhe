module.exports = Behavior({
  data: {
    _sku: {},
    sku: {
      // imageList: [], // 商品图片
      // optionList:[], // 规格信息
      // stockList:[], // 存储信息，每次入库生成一条记录
    },
  },
  methods: {
    initSku: function (sku) {
      this.data._sku = sku;
      this.data.sku = { ...sku };
    },
    checkSkuImageList: function (sku) {
      if (!sku.imageList || sku.imageList.length <= 0) {
        this.showToastError('至少添加一张图片');
        return false;
      }
      return true;
    },
    checkSkuSpecList: function (spu, sku) {
      const optionList = sku.optionList ?? [];
      if (optionList.length <= 0) {
        this.showToastError('选择规格信息！');
        return false;
      }
      const selected = [];
      spu.skuList?.forEach(({ optionList }) => {
        selected.push(optionList);
      });
      const hasSelected = selected.some((list) =>
        optionList.every((option, index) => option._id === list[index]._id),
      );
      if (hasSelected) {
        this.showToastError('规格信息重复！');
      }
      return !hasSelected;
    },
  },
});
