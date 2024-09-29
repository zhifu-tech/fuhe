export default {
  saasId: '88888888',
  spuId: '1001',
  storeId: '1000',
  title: '张一的海参',
  availalbe: 1,
  isPutOnSale: 1,
  categoryIds: ['127880527393854975', '127880527393854976', '127880537778953984'],
  specList: [
    {
      id: '10011',
      title: '颜色',
      values: [
        {
          id: '10012',
          value: '米色荷叶边',
          specId: '10011',
        },
      ],
    },
    {
      id: '10013',
      title: '尺码',
      values: [
        {
          id: '10014',
          value: 'S',
          saasId: '88888888',
          specId: '10013',
        },
        {
          id: '10015',
          value: 'M',
          saasId: '88888888',
          specId: '10013',
        },
        {
          id: '10016',
          value: 'L',
          saasId: '88888888',
          specId: '10013',
        },
      ],
    },
  ],
  skuList: [
    {
      id: '185003687',
      image: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
      specInfo: [
        {
          specId: '10011',
          valueId: '10012',
        },
        {
          specId: '10013',
          valueId: '10014',
        },
      ],
      costPrice: '1234', // 成本价格
      listPrice: '1580', // 原价或划线价格
      promoPrice: '1380', // 促销价格
      stockInfo: {
        quantity: 3,
      },
    },
  ],
};
