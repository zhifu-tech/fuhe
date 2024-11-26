module.exports = Behavior({
  data: {
    header: {
      userName: '小福', // 当前登录用户名
      storeName: '北京福和德运商贸有限公司', // 选择小店
      avatarUrl: '',
      avatarText: '福和德运',
    },
  },
  methods: {
    handleHeaderClick: function () {
      console.log('header click');
      wx.navigateTo({
        url: '/package-user/auth/index',
        events: {},
      });
    },
  },
});
