const saasList = [
  {
    id: '666666',
    title: '北京福和德运商贸有限公司',
  },
];
const categoryList = [
  {
    id: '1001',
    title: '手机',
    saasId: '666666',
  },
];
const specList = [
  {
    id: '2001',
    title: '颜色',
    cId: '1001',
  },
  {
    id: '2002',
    title: '内存',
    cId: '1001',
  },
];
const optionList = [
  {
    id: '3001',
    title: '红色',
    sId: '2001',
  },
  {
    id: '3002',
    title: '银色',
    sId: '2001',
  },
  {
    id: '3003',
    title: '64G',
    sId: '2002',
  },
  {
    id: '3004',
    title: '128G',
    sId: '2002',
  },
];
const spuList = [
  {
    id: '5001',
    cId: '1001',
    title: 'iPhone14',
    desc: '美国苹果公司制造的手机',
  },
];
const skuList = [
  {
    id: '4001',
    spuId: '5001',
    title: 'iPhone14 红色 64G',
    optionList: ['3001', '3004'],
    imageList: [
      'https://image/sku/4001/pic?thumb=1', //
      'https://image/sku/4001/pic',
    ],
    restockThreshold: 3,
    createdAt: '2024-01-01T00:00:00Z', // 创建时间
    updatedAt: '2024-01-01T00:00:00Z', // 更新时间
  },
  {
    id: '4002',
    spuId: '5001',
    title: 'iPhone14 银色 128G',
    optionList: ['3002', '3004'],
    imageList: [
      'https://image/sku/4002/pic?thumb=1', //
      'https://image/sku/4002/pic',
    ],
    restockThreshold: 3,
    createdAt: '2024-01-01T00:00:00Z', // 创建时间
    updatedAt: '2024-01-01T00:00:00Z', // 更新时间
  },
];
const stockList = [
  {
    skuId: '4001',
    location: '仓库A',
    availableQuantity: 50,
    onOrderQuantity: 20,
    restockThreshold: 10,
    costPrice: 100.0,
    retailPrice: 150.0,
    restockDate: '2024-01-01T00:00:00Z',
  },
  {
    skuId: '4001',
    location: '仓库B',
    availableQuantity: 30,
    onOrderQuantity: 10,
    restockThreshold: 5,
    costPrice: 110.0,
    retailPrice: 160.0,
    restockDate: '2024-01-05T00:00:00Z',
  },
  {
    skuId: '4002',
    location: '仓库B',
    availableQuantity: 30,
    onOrderQuantity: 10,
    restockThreshold: 5,
    costPrice: 110.0,
    retailPrice: 160.0,
    restockDate: '2024-01-05T00:00:00Z',
  },
];
const goods = [
  {
    saasId: '66666',
    spuId: '5001',
    skuList: [
      {
        id: '4001',
        stockList: [],
      },
      {
        id: '4001',
        stockList: [],
      },
    ],
    specList: [
      {
        id: '2001',
        optionList: [
          {
            id: '3001',
          },
          {
            id: '3002',
          },
        ],
      },
    ],
  },
];
