import { envId } from './cloud-config';
import { init as initCloudClientSdk } from '@cloudbase/wx-cloud-client-sdk';

App({
  globalData: {
    saasId: '666666',
    openid: null,
  },
  onLaunch: async function (opts, data) {
    console.log('App Launch', opts);
    if (data && data.path) {
      wx.navigateTo({
        url: data.path,
      });
    }
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: envId,
        traceUser: true,
      });
      initCloudClientSdk(wx.cloud);
    }
  },
  onShow(opts) {
    console.log('App Show', opts);
  },
  onHide() {
    console.log('App Hide');
  },
  getUserOpenId(callback) {
    const self = this;
    if (self.globalData.openId) {
      callback(null, self.globalData.openId);
      return;
    }
    wx.login({
      success(data) {
        wx.cloud.callFunction({
          name: 'cloudbase_module',
          data: {
            action: 'wx_user_get_open_id',
          },
          success: (res) => {
            console.log('拉取openid成功', res);
            self.globalData.openid = res.result.openid;
            callback(null, self.globalData.openid);
          },
          fail: (err) => {
            console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res);
            callback(res);
          },
        });
      },
      fail(err) {
        console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err);
        callback(err);
      },
    });
  },
  async getUserOpenIdViaCloud() {
    const res = await wx.cloud.callFunction({
      name: 'wxContext',
      data: {},
    });
    this.globalData.openid = res.result.openid;
    return res.result.openid;
  },
});
