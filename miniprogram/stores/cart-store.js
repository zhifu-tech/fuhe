import log from '@/common/log/log';
import { observable, action, computed } from 'mobx-miniprogram';
export default (function store() {
  const cart = {
    cartSpuList: [
      // { // cartSpu
      //   spuId: '',
      //   cartSkuList: [{ // cartSku
      //       skuId: '',
      //       cartStockList: [{ // cartStock
      //           stockId: '',
      //           cartSaleList: [{ // cartSale
      //               salePrice: 0,
      //               originalPrice: 0,
      //               saleQuantity: 0,
      //               originalQuantity: 0,
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //   ],
      // },
    ],
  };
  return observable({
    _cartSkuSumInfo: new Map(),

    getCartSkuSumInfo: function (skuId) {
      return this._cartSkuSumInfo.get(skuId);
    },

    handleCartChange: action(function ({
      tag, //
      spuId,
      skuId,
      stockId,
      salePrice,
      saleQuantity,
    }) {
      if (saleQuantity === 0) {
        // 选择数量为0，从cart中删除
        this._removeStockFromCart({
          tag,
          spuId,
          skuId,
          stockId,
          salePrice,
        });
      } else {
        // 选择数量不为0，更新cart中的库存
        this._updateStockInCart({
          tag,
          spuId,
          skuId,
          stockId,
          salePrice,
          saleQuantity,
        });
      }
      this._updateCartSkuSumInfo(tag, spuId, skuId);
      log.info(tag, 'handleCartChange', cart, this._cartSkuSumInfo);
    }),
    _removeStockFromCart: action(function ({
      tag, //
      spuId,
      skuId,
      stockId,
      salePrice,
    }) {
      const cartSpu = cart.cartSpuList?.find((cartSpu) => cartSpu.spuId === spuId);
      if (!cartSpu) {
        // 没有找到cartSpu，无需移除操作，直接返回
        return;
      }
      const cartSku = cartSpu.cartSkuList?.find((cartSku) => cartSku.skuId === skuId);
      if (!cartSku) {
        // 没有找到cartSku，无需移除操作，直接返回
        return;
      }
      const cartStock = cartSku.cartStockList?.find((cartStock) => cartStock.stockId === stockId);
      if (!cartStock) {
        // 没有找到cartStock，无需移除操作，直接返回
        return;
      }
      // 一个库存，可以按照多个价格加入购物车，删除时，需要制定删除的价格
      const cartSale = cartStock.cartSaleList?.find((cartSale) => cartSale.salePrice === salePrice);
      if (!cartSale) {
        // 没有找到cartSale，无需移除操作，直接返回
        return;
      }
      // 从cartSale中移除stock
      cartStock.cartSaleList.splice(cartStock.cartSaleList.indexOf(cartSale), 1);

      // 如果cartStock的cartSaleList为空，从cartSku中移除cartStock
      if (cartStock.cartSaleList.length === 0) {
        cartSku.cartStockList.splice(cartSku.cartStockList.indexOf(cartStock), 1);
      }
      // 如果cartSku的cartStockList为空，从cartSpu中移除cartSku
      if (cartSku.cartStockList.length === 0) {
        cartSpu.cartSkuList.splice(cartSpu.cartSkuList.indexOf(cartSku), 1);
      }
      // 如果cartSpu的cartSkuList为空，从cart中移除 cartSpu
      if (cartSpu.cartSkuList.length === 0) {
        cart.cartSpuList.splice(cart.cartSpuList.indexOf(cartSpu), 1);
      }
    }),
    _updateStockInCart: action(function ({
      tag, //
      spuId,
      skuId,
      stockId,
      salePrice,
      saleQuantity,
    }) {
      let cartSpu = cart.cartSpuList.find((cartSpu) => cartSpu.spuId === spuId);
      if (!cartSpu) {
        // 没有找到cartSpu，直接创建
        cartSpu = {
          spuId,
          cartSkuList: [],
        };
        cart.cartSpuList.push(cartSpu);
      }
      let cartSku = cartSpu.cartSkuList.find((cartSku) => cartSku.skuId === skuId);
      if (!cartSku) {
        // 没有找到cartSku，直接创建
        cartSku = {
          skuId,
          cartStockList: [],
        };
        cartSpu.cartSkuList.push(cartSku);
      }
      let cartStock = cartSku.cartStockList.find((cartStock) => cartStock.stockId === stockId);
      if (!cartStock) {
        // 没有找到cartStock，直接创建
        cartStock = {
          stockId,
          cartSaleList: [],
        };
        cartSku.cartStockList.push(cartStock);
      }
      // 一个库存，可以按照多个价格加入购物车，更新时，需要制定更新的价格
      let cartSale = cartStock.cartSaleList.find((cartSale) => cartSale.salePrice === salePrice);
      if (!cartSale) {
        // 没有找到cartSale，直接创建
        cartSale = {
          salePrice,
        };
        cartStock.cartSaleList.push(cartSale);
      }
      // 更新cartSale
      cartSale.saleQuantity = saleQuantity;
    }),
    _updateCartSkuSumInfo: action(function (tag, spuId, skuId) {
      const cur = cart.cartSpuList
        ?.find((cartSpu) => cartSpu.spuId === spuId)
        ?.cartSkuList?.find((cartSku) => cartSku.skuId === skuId)
        ?.cartStockList?.flatMap((cartStock) => cartStock.cartSaleList)
        ?.reduce(
          (acc, cartSale) => ({
            sumPrice: acc.sumPrice + cartSale.salePrice,
            sumQuantity: acc.sumQuantity + cartSale.saleQuantity,
          }),
          { sumPrice: 0, sumQuantity: 0 },
        );
      const pre = this._cartSkuSumInfo.get(skuId);
      // log.info(tag, 'updateCartSkuSumInfo', cur, pre);
      if (!cur && !pre) {
        // cart中没有sku，为移除或者价格变动（在为选择任何件数时，价格变动）
        this._cartSkuSumInfo.set(skuId, {});
      } else if (!pre) {
        this._cartSkuSumInfo.set(skuId, cur);
      } else if (!cur) {
        this._cartSkuSumInfo.delete(skuId);
      } else {
        this._cartSkuSumInfo.set(skuId, cur);
      }
    }),
  });
})();
