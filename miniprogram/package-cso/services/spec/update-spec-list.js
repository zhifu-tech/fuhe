import log from '@/common/log/log';
import specStore from '../../stores/spec/index';
import specModel from '../../models/spec/index';

export default async function ({ tag, cId, specList }) {
  try {
    const res = await specModel.updateMany({ tag, specList });

    specStore.updateSpecList(cId, specList);
    log.info(tag, 'update-spec-list success', res);
    return res;
  } catch (e) {
    log.error(tag, 'update-spec-list error', e);
    throw e;
  }
}
