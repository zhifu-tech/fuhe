Component({
  options: {
    virtualHost: true,
  },
  data: {
    active: 'store',
    list: [
      {
        icon: 'app',
        label: '小店',
        value: 'store',
        pagePath: '/pages/store/index',
      },
      {
        icon: 'file-1',
        label: '订单',
        value: 'order',
        pagePath: '/pages/order/index',
      },
    ],
  },
  methods: {
    init: function () {
      const page = getCurrentPages()[0];
      const route = page.route.split('/')[1];
      const item = this.data.list.find((it) => it.value === route);
      this.setData({ active: item.value });
    },
    onChange: function (e) {
      const { value: active } = e.detail;
      const { list } = this.data;
      const item = list.find((it) => it.value === active);
      wx.switchTab({
        url: item.pagePath,
      });
      this.setData({ active });
    },
  },
});
