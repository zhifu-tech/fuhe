import { envId } from './cloud-config';
import { init as initCloudClientSdk } from '@cloudbase/wx-cloud-client-sdk';

App({
  globalData: {
    saasId: '666666',
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
});
