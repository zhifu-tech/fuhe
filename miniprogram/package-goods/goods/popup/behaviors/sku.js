import stores from '@/stores/index.js';
import { showToastError } from '@/common/toast/simples.js';

module.exports = Behavior({
  methods: {
    checkSkuImageList: function (sku) {
      if (!sku.imageList || sku.imageList.length <= 0) {
        showToastError({ message: '至少添加一张图片' });
        return false;
      }
      return true;
    },
    checkSkuSpecList: function (spu, sku) {
      const optionList = sku.optionList ?? [];
      if (optionList.length <= 0) {
        showToastError({ message: '选择规格信息！' });
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
        showToastError({ message: '规格信息重复！' });
      }
      return !hasSelected;
    },

    handleAddImage: function (e) {
      const { sku } = this.data;
      const { files } = e.detail;
      const imageList = sku.imageList || [];
      stores.goods.sku.updateSkuImageList({
        sku,
        imageList: [...imageList, ...files],
      });
    },
    handleRemoveImage: function (e) {
      const { index } = e.detail;
      const { sku } = this.data;
      const imageList = sku.imageList || [];
      stores.goods.sku.updateSkuImageList({
        sku,
        imageList: imageList.toSpliced(index, 1),
      });
    },
  },
});
