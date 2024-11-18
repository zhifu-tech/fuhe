import log from '@/common/log/log';
import orderStore from '../../../stores/order/index';
import cartService from '../../../services/cart/index';
import { showToastError, showToastLoading, showToastSuccess } from '@/common/toast/simples';

module.exports = Behavior({
  methods: {
    handleCartOnceMore: async function (e) {
      const { tag } = this.data;
      const { orderId } = e.target.dataset;
      const order = orderStore.getOrder(orderId);
      if (!order) {
        showToastError('订单不存在');
        return;
      }
      showToastLoading({ message: '更新中..' });
      // 再次添加到购物车
      try {
        await cartService.addCartRecordList({
          tag,
          infoList: order.itemList.map((item) => ({
            spuId: item.spuId,
            skuId: item.skuId,
            stockId: item.stockId,
            saleQuantity: item.saleQuantity,
            salePrice: item.salePrice,
          })),
        });
        showToastSuccess({ message: '已经加入购物车！' });
      } catch (error) {
        showToastError({ message: `未知错误，请稍后再试！` });
        log.error(tag, 'addCartRecordList', error);
      }
    },
  },
});
