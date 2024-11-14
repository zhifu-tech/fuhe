import stores from '@/stores/index';
import { showToastError } from '@/common/toast/simples';
import { autorun } from 'mobx-miniprogram';

module.exports = Behavior({
  lifetimes: {
    attached: function () {
      this.addToAutoDisposable(
        autorun(() => {
          const skuList = this.data.spu?.skuList || [];
          this.setData({ skuList });
        }),
      );
    },
  },
  methods: {
    handleUpdateSpuTitle: function (e) {
      const { value: title } = e.detail;
      const { tag, spu } = this.data;
      stores.goods.spu.updateSpuInfo({ tag, spu, title });
    },
    handleUpdateSpuDesc: function (e) {
      const { value: desc } = e.detail;
      const { tag, spu } = this.data;
      stores.goods.spu.updateSpuInfo({ tag, spu, desc });
    },
    checkSpuTitle: function (spu, useToast = true) {
      if (!spu.title) {
        if (useToast) {
          showToastError({ message: '请输入商品名称！' });
        }
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
        showToastError({ message: '请选择商品分类！' });
        return false;
      }
      return true;
    },
    checkSpuSpecList: function (spu) {
      if (spu.specList.length === 0) {
        showToastError({ message: '该商品分类不可用，请重新选择！' });
        return false;
      }
      return true;
    },
  },
});
