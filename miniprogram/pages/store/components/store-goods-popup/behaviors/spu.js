module.exports = Behavior({
  data: {
    _spu: {}, // 输入spu信息
    spu: {
      // title: '',
      // desc: '',
      // category: {}, // 商品分类
      // supplier: {}, // 供应商
      // specList: [],
      // skuList: [],
    },
  },
  methods: {
    initSpu: function (spu) {
      this.data._spu = spu || {};
      this.data.spu = (spu && { ...spu }) ?? {};
    },
    handleUpdateSpuTitle: function (e) {
      const { value: title } = e.detail;
      this.setData({
        'spu.title': title,
      });
    },
    handleUpdateSpuDesc: function (e) {
      const { value: desc } = e.detail;
      this.setData({
        'spu.desc': desc,
      });
    },
    checkSpuTitle: function (spu) {
      if (!spu.title) {
        this.showToastError('请输入商品名称！');
        this.setData({
          'spu.titleTips': '商品名称为必填项',
          'spu.titleStatus': 'error',
        });
        return false;
      } else {
        if (spu.titleTips || spu.titleStatus) {
          this.setData({
            'spu.titleTips': '',
            'spu.titleStatus': '',
          });
        }
        return true;
      }
    },
    checkSpuCategory: function (spu) {
      if (!spu.category || !spu.category.title) {
        this.showToastError('请选择商品分类！');
        return false;
      }
      return true;
    },
    checkSpuSpecList: function (spu) {
      if (spu.specList.length === 0) {
        this.showToastError('该商品分类不可用，请重新选择！');
        return false;
      }
      return true;
    },
  },
});
