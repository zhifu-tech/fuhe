import Dialog from 'tdesign-miniprogram/dialog/index';
import services from '@/services/index';
import log from '@/common/log/log';
import pages from '@/common/page/pages';

module.exports = Behavior({
  methods: {
    showSkuDeleteDialog: function () {
      const { tag, sku } = this.data;
      // 有库存时，不可以删除
      const hasStock = sku.stockList?.some((stock) => stock.quantity > 0);
      if (hasStock) {
        this.showToastError('有库存时，不可以删除');
        return;
      }
      Dialog.confirm({
        context: pages.currentPage().store(),
        title: '删除库存',
        content: '删除库存会导致关联的信息不可用？',
        confirmBtn: '确认删除',
        cancelBtn: '取消',
        zIndex: pages.zIndexDialog,
        overlayProps: {
          zIndex: pages.zIndexDialogOverlay,
        },
      })
        .then(() => {
          this._deleteSku();
        })
        .catch((error) => {
          log.info(tag, 'sku-delete', 'cancel', error);
        });
    },
    _deleteSku: async function () {
      const { tag, spu, sku } = this.data;
      await services.goods.skuDelete({
        tag,
        id: sku._id,
      });
      this.triggerEvent('sku-delete', {
        sku,
      });
    },
  },
});
