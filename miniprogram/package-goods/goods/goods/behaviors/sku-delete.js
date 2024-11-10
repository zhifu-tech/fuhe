import log from '@/common/log/log';
import services from '@/services/index';
import { showToastError } from '@/common/toast/simples';
import { showConfirmDialog } from '@/common/dialog/simples';

module.exports = Behavior({
  methods: {
    showSkuDeleteDialog: function () {
      const { tag, sku } = this.data;
      // 有库存时，不可以删除
      const hasStock = sku.stockList?.some((stock) => stock.quantity > 0);
      if (hasStock) {
        showToastError({ message: '有库存时，不可以删除' });
        return;
      }
      showConfirmDialog({
        title: '删除库存',
        content: '删除库存会导致关联的信息不可用？',
        confirmBtn: '确认删除',
        cancelBtn: '取消',
        confirm: () => {
          this._deleteSku();
        },
        cancel: (error) => {
          log.info(tag, 'sku-delete', 'cancel', error);
        },
      });
    },
    _deleteSku: async function () {
      const { tag, spuId, skuId } = this.data;
      await services.goods.deleteGoodsSku({
        tag,
        spuId,
        skuId,
      });
    },
  },
});
