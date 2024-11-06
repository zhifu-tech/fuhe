import log from '@/common/log/log';
import specStore from '../../stores/spec/index';
import specModel from '../../models/spec/index';

export default async function ({ tag, cId, useStore = true }) {
  if (useStore) {
    const storeSpecList = specStore.getSpecList(cId);
    if (storeSpecList) {
      log.info(tag, 'get-spec-list from store');
      return storeSpecList;
    }
  }
  try {
    const { records: specList } = await specModel.list({ tag, cId });

    specStore.setSpecList(cId, specList);
    log.info(tag, 'get-spec-list from cloud');
    return specList;
  } catch (e) {
    log.error(tag, 'get-spec-list from cloud error', e);
    throw error;
  }
}
