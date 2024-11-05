购物车 Cart 设计文档

## 1. 购物车设计

### 1.1 购物车数据结构

```js
const cart = {
  cartSpuList: [
    {
      // cartSpu
      spuId: '',
      cartSkuList: [
        {
          // cartSku
          skuId: '',
          cartStockList: [
            {
              // cartStock
              stockId: '',
              cartSaleList: [
                {
                  // cartSale
                  salePrice: 0,
                  originalPrice: 0,
                  saleQuantity: 0,
                  originalQuantity: 0,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
```

### 1.2 购物车数据结构说明

- cartSpuList: 购物车商品列表
  - spuId: 商品 id
  - cartSkuList: 商品规格列表
    - skuId: 规格 id
    - cartStockList: 规格库存列表
      - stockId: 库存 id
      - cartSaleList: 规格销售列表
        - salePrice: 销售价
        - originalPrice: 原价
        - saleQuantity: 销售数量
        - originalQuantity: 原始数量，即该规格的加入之前的数量

### 1.3 购物车数据结构示例

```js
const cart = {
  cartSpuList: [
    {
      spuId: '1',
      cartSkuList: [
        {
          skuId: '1',
          cartStockList: [
            {
              stockId: '1',
              cartSaleList: [
                {
                  salePrice: 100,
                  originalPrice: 100,
                  saleQuantity: 1,
                  originalQuantity: 1,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
```

## 2. 购物车
