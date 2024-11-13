import log from '@/common/log/log';
import stores from '@/stores/index';
import { autorun, runInAction, isObservable } from 'mobx-miniprogram';

module.exports = Behavior({
  behaviors: [
    require('miniprogram-computed').behavior, //
    require('@/common/mobx/auto-disposers'),
  ],
  watch: {
    spu: function () {
      // 防止重复监听
      if (this.disposers) return;
      // 等到spu被初始化之后，在开启监听，否则监听不到
      this.addToAutoDispose(
        autorun(() => {
          this.setData({
            supplierName:
              this.data.spu?.supplier?.name || // 从实体列表选择的，优先级相对高
              this.data.spu?.supplierName || // 已经设置过的
              '',
          });
        }),
      );
    },
  },
  methods: {
    showSupplierPicker: function () {
      const title = '选择供应商';
      wx.navigateTo({
        url: `/package-mix/entity/list/index?title=${title}`,
        events: {
          pickedEntity: (entityId) => {
            runInAction(() => {
              if (entityId !== this.data.spu.supplier?._id) {
                const entity = stores.entity.getEntity(entityId);
                this.data.spu.supplier = entity;
              }
            });
          },
        },
      });
    },
  },
});
