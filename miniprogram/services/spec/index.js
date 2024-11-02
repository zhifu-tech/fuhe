import log from '@/common/log/log';
import specStore from '@/stores/spec-store';
import categoryStore from '@/stores/category-store';

import _list from './list';
import _listBatch from './list-batch';
import { createMany as _createMany } from './create';
import { updateMany as _updateMany } from './update';
import { deleteMany as _deleteMany } from './delete';

export default {
  getSpecList: async function ({ tag, cId }) {
    const storeSpecList = specStore.getSpecList(cId);
    if (storeSpecList) {
      return storeSpecList;
    }
    const { records: specList } = await _list({ tag, cId });
    specStore.setSpecList(cId, specList);
    return specList;
  },
  /**
   * 获取规格列表，如果缓存中存在则直接返回，否则从数据库获取并缓存
   */
  getSpecListBatch: async function ({ tag, cIdList }) {
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

    // 如果有未缓存的 cId，需要从 _listBatch 获取并更新 specListMap
    if (cIdListUnstore.length > 0) {
      const map = await _listBatch({ tag, cIdList: cIdListUnstore });
      map.forEach((specList, cId) => {
        specListMap.set(cId, specList);
        specStore.setSpecList(cId, specList);
      });
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
    specStore.addSpecList(cId, specList);
    return specList;
  },
  updateSpecMany: async function ({ tag, cId, specList }) {
    await _updateMany({ tag, specList });
    specStore.updateSpecList(cId, specList);
  },
  deleteSpecMany: async function ({ tag, cId, specIdList }) {
    await _deleteMany({ tag, cId, _ids: specIdList });
    specStore.deleteSpecList(cId, specIdList);
  },
};
