const { default: log } = require('../../../common/log/log');

module.exports = Behavior({
  data: {
    cart: {
      _cartSpuList: [],
    },
    // cart: {
    //   spuList: [
    //     {
    //       // spu
    //       _cartSkuList: [
    //         {
    //           // sku
    //           summary: {
    //             // 外显的汇总操作，只在所有库存的销售价格一致时生效
    //             salePrice: 0,
    //             originalPrice: 0, // 取所有商品的最大的原价
    //             saleQuantity: 0, // 选择的总数
    //             originalQuantity: 0,
    //           },
    //           _cart_stockList: [
    //             {
    //               // stock,
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
  },
  methods: {
    handleCartChangeEvent: function (e) {
      const { spu, sku } = e.detail;

      // 如果spu选中商品，从购物车移除
      if (!spu._cartSkuList || spu._cartSkuList.length === 0) {
        this._removeSpuFromCart(spu);
      } else {
        this._updateSpuInCart(spu);
      }
      this._printCartInfo();
    },
    _removeSpuFromCart: function (spu) {
      const { _cartSpuList } = this.data.cart;
      const spuIndex = _cartSpuList.findIndex((item) => item._id === spu._id);
      if (spuIndex === -1) return;
      _cartSpuList.splice(spuIndex, 1);
    },
    _updateSpuInCart: function (spu) {
      const { _cartSpuList } = this.data.cart;
      const spuIndex = _cartSpuList.findIndex((item) => item._id === spu._id);
      if (spuIndex === -1) {
        _cartSpuList.push(spu);
      } else {
        _cartSpuList[spuIndex] = spu;
      }
    },
    _printCartInfo: function () {
      const { _cartSpuList } = this.data.cart;
      log.info('cart spu size ', _cartSpuList.length);
      _cartSpuList.forEach((spu, i) => {
        log.info('cart spu ', i, ' is ', spu.title);
        spu._cartSkuList.forEach((sku, j) => {
          log.info('cart sku ', j, ' is ', sku);
          sku._cartStockList.forEach((stock, k) => {
            log.info(
              `cart stock ${k} is  `,
              stock.salePrice,
              stock.originalPrice,
              stock.saleQuantity,
              stock.quantity,
            );
          });
        });
      });
    },
  },
});
