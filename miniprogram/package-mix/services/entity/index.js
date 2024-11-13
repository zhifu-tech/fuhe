import log from '@/common/log/log';
import { flow } from 'mobx-miniprogram';
import entityModel from '../../models/entity/index';
import entityStore from '../../stores/entity/index';

export default {
  // 拉取所有的实体列表
  fetchEntityList: (function () {
    let _task = null;
    return function ({ tag, trigger, callback }) {
      if (_task) _task.cancel();
      _task = _fetchEntityList({
        tag,
        trigger,
        callback,
        _finally: () => (_task = null),
      });
      return _task;
    };
  })(),
  // 拉取指定的实体列表
  fetchEntityByIdList: function ({ tag, trigger, idList, callback }, _finally) {
    log.info(tag, 'fetchEntityByIdList', trigger);
    // TODO: 拉取指定的实体列表
  },
};

const _fetchEntityList = flow(function* ({ tag, trigger, callback, _finally }) {
  callback({ code: 'loading', trigger });
  log.info(tag, 'fetchEntityList', trigger);
  try {
    const { records: entityList, total } = yield entityModel.all({ tag });

    // 增加pinyin支持
    _setEntityPinyinAndSort(entityList);

    // 保存到store
    entityStore.setEntityList({ tag, entityList, total });

    // 通知更新
    callback({ code: 'success', trigger, entityList, total });
    log.info(tag, 'fetchEntityList', 'success');
  } catch (error) {
    if (error.message === 'FLOW_CANCELLED') {
      // 判断任务是否被取消
      callback({ code: 'cancel', trigger });
      log.info(tag, 'fetchEntityList was cancelled');
    } else {
      // 请求失败，切换选中状态
      callback({ code: 'error', trigger });
      log.error(tag, 'fetchEntityList error', error);
    }
    throw error;
  } finally {
    _finally?.();
  }
});

function _setEntityPinyinAndSort(list) {
  const pinyin = require('js-pinyin');
  pinyin.setOptions({ checkPolyphone: false, charCase: 0 });
  list.forEach((item) => {
    item.camel = pinyin.getCamelChars(item.name);
  });
  list.sort(({ camel: a }, { camel: b }) => {
    if (a > b) return 1;
    else if (a < b) return -1;
    else return 0;
  });
}
