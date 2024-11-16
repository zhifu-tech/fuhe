import stores from '@/stores/index';
import { autorun, runInAction } from 'mobx-miniprogram';

module.exports = Behavior({
  data: {
    supplierName: '',
  },
  lifetimes: {
    attached: function () {
      this.addToAutoDisposable(
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
