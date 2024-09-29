Component({
  options: {
    virtualHost: true,
    styleIsolation: 'shared',
  },
  data: {
    active: 'store',
    list: [
      {
        icon: 'app',
        label: '小店',
        value: 'store',
        url: '/pages/store/index',
      },
      {
        icon: 'chart-analytics',
        label: '统计',
        value: 'chart',
        url: '/pages/cart/index',
      },
      {
        icon: 'user',
        label: '我的',
        value: 'user',
        url: '/pages/user/index',
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
        url: item.url,
      });
    },
  },
});
