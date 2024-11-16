import log from '@/common/log/log';
import services from '@/services/index';
import cartStore from '../../../stores/cart/index';
import cartService from '../../../services/cart/index';
import orderService from '../../../services/order/index';
import { flow } from 'mobx-miniprogram';
import { showToastError, showToastLoading, hideToastLoading } from '@/common/toast/simples';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  methods: {
    handleMakeOrder: flow(function* () {
      // 显示创建中
      showToastLoading({ message: '正在下单...' });

      const { tag } = this.data;
      try {
        const order = yield orderService.createOrder({
          tag,
          // 下单用户
          userId: this.data.userId || 'unknown',
          userName: this.data.userName || 'unknown',
          // 客户
          customerId: this.data.customerId || 'unknown',
          customerName: this.data.customerName || 'unknown',
          // 供应方
          providerId: this.data.providerId || 'unknown',
          providerName: this.data.providerName || 'unknown',
          // 订单信息
          infoList: cartStore.dataList.map((item) => ({
            // 订单信息
            orderId: '',
            // 商品信息
            spuId: item.spuId,
            spuTitle: item.spu.title,
            // 商品规格信息
            skuId: item.skuId,
            skuTitle: 'todo', // fixme
            // 库存信息
            stockId: item.stockId,
            // 供应商信息
            supplierId: item.supplierId || 'unknown',
            supplierName: item.supplier?.name || 'unknown',
            // 价格、数量信息
            salePrice: item.salePrice,
            saleQuantity: item.saleQuantity,
            originalPrice: 0, // fixme
          })),
        });
        log.info(tag, 'createOrder success', order);
      } catch (error) {
        log.error(tag, 'createOrder error', error);
        showToastError({ message: '下单失败，请稍后再试！' });
        return;
      }

      // 更新库存信息
      try {
        yield services.stock.updateStockInfoList({
          tag,
          infoList: cartStore.dataList.map((item) => ({
            stock: item.stock,
            quantity: item.stock.quantity - item.saleQuantity,
            salePrice: item.salePrice,
          })),
        });
        log.info(tag, 'updateStockInfoList success');
      } catch (error) {
        log.error(tag, 'updateStockInfoList error', error);
        showToastError({ message: '下单失败，请稍后再试！' });
        return;
      }
      // 清空购物数据
      cartStore.dataList.forEach(({ stock }) => {
        stock.saleQuantity = 0;
      });

      try {
        // 清空购物车的数据
        yield cartService.clearCart({ tag });
        log.info(tag, 'clearCart success');
      } catch (error) {
        log.error(tag, 'clearCart error', error);
        showToastError({ message: '下单失败，请稍后再试！' });
      } finally {
        hideToastLoading();
      }
    }),
  },
});
