const AuthStepType = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
};

Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    currAuthStep: {
      type: Number,
      value: AuthStepType.ONE,
    },
    userInfo: {
      type: Object,
      value: {},
    },
    isNeedGetUserInfo: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    defaultAvatarUrl: 'https://cdn-we-retail.ym.tencent.com/miniapp/usercenter/icon-user-center-avatar@2x.png',
    AuthStepType,
  },
  methods: {
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
