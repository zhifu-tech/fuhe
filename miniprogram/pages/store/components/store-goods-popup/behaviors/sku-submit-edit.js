import { uploadSkuImageList, deleteImageFiles } from './images';
import log from '@/common/log/log';
import services from '@/services/index';

module.exports = Behavior({
  observers: {
    'sku.imageList': function () {
      if (this.data.isModeEditSku) {
        this._checkSubmitEditSkuEnabled();
      }
    },
  },
  methods: {
    _checkSubmitEditSkuEnabled: function () {
      const { sku, _sku } = this.data;
      // 如果数据发生变化，则开启提交
      const submitDisabled =
        sku.imageList.length === _sku.imageList.length &&
        sku.imageList.every((img, index) => {
          const srcImage = _sku.imageList[index];
          return srcImage == img;
        });
      if (submitDisabled !== this.data.submitDisabled) {
        this.setData({
          submitDisabled,
        });
      }
    },
    _submitEditSku: async function () {
      // 对于imageList的修改，有新增/移除和改变顺序三种操作
      const { tag, sku, _sku } = this.data;
      try {
        // 上传新增的图片
        await uploadSkuImageList(sku);
        // 删除移除的图片
        const deleted = [];
        _sku.imageList.forEach((_img) => {
          if (!sku.imageList.some((img) => img === _img)) {
            deleted.push(_img);
          }
        });
        if (deleted.length > 0) {
          await deleteImageFiles(deleted);
        }
        // 提交修改
        await services.goods.skuUpdate({
          tag,
          skuId: sku._id,
          imageList: sku.imageList,
        });
        _sku.imageList = sku.imageList;

        this.notify();
        this.hideToast();
      } catch (error) {
        log.error(tag, 'update spu error', error);
        this.showToastError('未知错误，稍后重试!');
      } finally {
        this.hide();
      }
    },
  },
});
