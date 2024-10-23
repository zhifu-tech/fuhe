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
      {
        icon: 'chart-analytics',
        label: '统计',
        value: 'chart',
        pagePath: '/pages/cart/index',
      },
      {
        icon: 'user',
        label: '我的',
        value: 'user',
        pagePath: '/pages/user/index',
      },
    ],
  },
  methods: {
    onChange(e) {
      const { value: active } = e.detail;
      const { list } = this.data;
      this.setData({
        active,
      });
      const item = list.find((it) => it.value === active);
      wx.switchTab({
        url: item.pagePath,
      });
    },
  },
});
