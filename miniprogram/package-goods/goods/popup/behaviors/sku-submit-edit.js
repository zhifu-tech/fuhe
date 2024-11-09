import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';
import { autorun } from 'mobx-miniprogram';

import { uploadSkuImageList, deleteImageFiles } from '@/common/image/images';
import { showToastError, showToastLoading, hideToastLoading } from '@/common/toast/simples';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  watch: {
    isModeEditSku: function () {
      // 绑定提交按钮的函数
      this.data._submitFn = this._submitEditSku.bind(this);
      // 监听数据的变化
      this.disposer = autorun(() => {
        const { sku, _sku } = this.data;
        if (!sku || !_sku) return;
        // 如果数据发生变化，则开启提交
        const submitDisabled =
          (sku.imageList &&
            _sku.imageList &&
            sku.imageList.length === _sku.imageList.length &&
            sku.imageList.every((img, index) => {
              const srcImage = _sku.imageList[index];
              return srcImage == img;
            })) ||
          !this.checkSkuImageList(sku);

        if (submitDisabled !== this.data.submitDisabled) {
          this.setData({
            submitDisabled,
          });
        }
      });
    },
  },
  lifetimes: {
    detached: function () {
      this.disposer?.();
      this.disposer = null;
    },
  },
  methods: {
    _submitEditSku: async function () {
      // 对于imageList的修改，有新增/移除和改变顺序三种操作
      const { tag, sku, _sku } = this.data;
      showToastLoading({});
      try {
        const promises = [];
        // 上传新增的图片
        promises.push(uploadSkuImageList(sku));
        // 删除移除的图片
        const deleted = [];
        _sku.imageList?.forEach((_img) => {
          if (!sku.imageList.some((img) => img === _img)) {
            deleted.push(_img);
          }
        });
        if (deleted.length > 0) {
          promises.push(deleteImageFiles(deleted));
        }
        // 提交图片的修改，待成功获得图片地址后，提交修改
        await Promise.all(promises);
        // 提交修改
        await services.goods.skuUpdateImageList({
          tag,
          skuId: sku._id,
          imageList: sku.imageList,
        });

        // 更新store
        stores.goods.sku.updateSkuImageList({
          sku: _sku,
          imageList: sku.imageList,
        });

        hideToastLoading();
        this.hide();
      } catch (error) {
        log.error(tag, 'update spu error', error);
        showToastError({ message: '未知错误，稍后重试!' });
      }
    },
  },
});
