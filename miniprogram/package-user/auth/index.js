Component({
  data: {
    defaultAvatarUrl:
      'https://cdn-we-retail.ym.tencent.com/miniapp/usercenter/icon-user-center-avatar@2x.png',
  },
  methods: {
    onGetUserInfo: function (e) {
      console.log('onGetUserInfo', e);
      this.setData({
        userInfo: e.detail.userInfo,
      });
    },
    onGetPhoneNumber: function (e) {
      console.log('onGetPhoneNumber', e);
      this.setData({
        phoneNumber: e.detail.phoneNumber,
      });
    },
    gotoUserEditPage() {
      // this.triggerEvent('gotoUserEditPage');
      wx.cloud.callFunction({
        name: 'cloudbase_module',
        data: {
          name: 'wx_user_get_open_id',
        },
        success: (res) => {
          const openId = res.result?.openId;
          console.log('获取到的openId：', openId);
        },
      });
      wx.cloud.callFunction({
        name: 'cloudbase_module',
        data: {
          name: 'wx_user_get_phone_number',
        },
        success: (res) => {
          const openId = res.result?.openId;
          console.log('获取到的openId：', openId);
        },
      });
    },
  },
});
