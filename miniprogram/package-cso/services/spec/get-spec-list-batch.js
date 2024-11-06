import log from '@/common/log/log';
import specStore from '../../stores/spec/index';
import specModel from '../../models/spec/index';

export default async function ({ tag, cIdList }) {
  // 获取规格列表，如果缓存中存在则直接返回，否则从数据库获取并缓存
  const specListMap = new Map();
  const cIdListUnstore = [];
  // 遍历 cIdList 并构建 specListMap，同时收集未缓存的 cId
  cIdList.forEach((cId) => {
    const specList = specStore.getSpecList(cId);
    if (specList) {
      specListMap.set(cId, specList);
    } else {
      cIdListUnstore.push(cId);
    }
  });

  try {
    // 如果有未缓存的 cId，需要从 _listBatch 获取并更新 specListMap
    if (cIdListUnstore.length > 0) {
      const map = await specModel.listBatch({ tag, cIdList: cIdListUnstore });
      map.forEach((specList, cId) => {
        specListMap.set(cId, specList);
        specStore.setSpecList(cId, specList);
      });
    }
    log.info(tag, 'get-spec-list-batch');
    return specListMap;
  } catch (error) {
    log.error(tag, 'get-spec-list-batch', error);
    throw error;
  }
}
