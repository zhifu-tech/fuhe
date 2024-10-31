import log from '@/common/log/log';
import services from '@/services/index';
import { saasId } from '@/common/saas/saas';
import { observable, action, flow } from 'mobx-miniprogram';

export default (function store() {
  return observable({
    //*****************
    // [START] 规格列表
    //*****************
    specListMap: new Map(), // map<cId, specList>

    fetchSpecListStatus: { code: 'idle' }, // 'loading', 'success', 'error'
    _fetchSpecListTask: null, // 记录当前正在进行的请求

    fetchSpecList: action(function (cId) {
      if (this._fetchSpecListTask) {
        this._fetchSpecListTask.cancel();
      }
      this.fetchSpecListStatus = { code: 'loading' };
      this._fetchSpecListTask = this._fetchSpecList(cId);
      return this._fetchSpecListTask;
    }),
    _fetchSpecList: flow(function* (cId) {
      try {
        const { records: specList } = yield services.spec.list({
          cId,
          saasId: saasId(),
        });

        this.specListMap.set(cId, specList);
        this.fetchSpecListStatus = { code: 'success' };

        log.info('spec-store', '_fetchSpecList result', specList);
      } catch (error) {
        log.error(error);
        this.fetchSpecListStatus = { code: 'error' };
      }
    }),
    //*****************
    // [END] 规格列表
    //*****************

    //*****************
    // [START] 规格操作
    //*****************
    getSpecList: function (cId) {
      return this.specListMap.get(cId);
    },
  });
})();
