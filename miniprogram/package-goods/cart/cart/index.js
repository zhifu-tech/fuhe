Component({
  behaviors: [require('./behaviors/mode')],
  options: {
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  data: {
    skuList: [],
    // {
    //   sku: {},
    //   stockList: [
    //     {
    //       stockId: '',
    //       selected: 3,
    //       salePrice: 123,
    //     },
    //   ],
    // },
  },
  methods: {},
});
