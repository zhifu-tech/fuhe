import spec from '@/stores/spec-store';

import _list from './list';
import _listBatch from './list-batch';
import { createMany as _createMany } from './create';
import { updateMany as _updateMany } from './update';
import { deleteMany as _deleteMany } from './delete';

export default {
  getSpecList: async function ({ tag, cId }) {
    const storeSpecList = spec.getSpecList(cId);
    if (storeSpecList) {
      return storeSpecList;
    }
    const { records: specList } = await _list({ tag, cId });
    spec.setSpecList(cId, specList);
    return specList;
  },
  getSpecListBatch: async function ({ tag, cIdList }) {
    let specListMap = new Map();
    // 过滤没有在store中的cId，并将存在的添加到map中
    const cIdListUnstore = cIdList.filter((cId) => {
      const specList = spec.getSpecList(cId);
      if (specList) {
        specListMap.set(cId, specList);
        return false;
      } else {
        return true;
      }
    });
    if (cIdListUnstore.length > 0) {
      // 获取未在store中的cId的specList
      const map = await _listBatch({ tag, cIdList: cIdListUnstore });
      // 将获取到的specList添加到store中
      map.forEach((specList, cId) => {
        specListMap.set(cId, specList);
      });
      // 将获取到的specList添加到map中
      specListMap = new Map([...specListMap, ...map]);
    }
    return specListMap;
  },
  creatSpecMany: async function ({ tag, cId, specList }) {
    const idList = await _createMany({
      tag,
      cId,
      titles: specList.map((it) => it.title),
    });
    specList.forEach((spec, index) => {
      spec.cId = cId;
      spec._id = idList[index];
    });
    spec.addSpecList(cId, specList);
    return specList;
  },
  updateSpecMany: async function ({ tag, cId, specList }) {
    await _updateMany({ tag, specList });
    spec.updateSpecList(cId, specList);
  },
  deleteSpecMany: async function ({ tag, cId, specIdList }) {
    await _deleteMany({ tag, cId, _ids: specIdList });
    spec.deleteSpecList(cId, specIdList);
  },
};
