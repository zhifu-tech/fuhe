import log from '@/common/log/log';
import specStore from '../../stores/spec/index';
import specModel from '../../models/spec/index';

export default async function ({ tag, cId, infoList }) {
  try {
    const res = await specModel.updateOptionMany({
      tag,
      infoList,
    });

    specStore.updateSpecOptionList({
      tag,
      cId,
      optionList: infoList.map((it) => it.option),
    });
    log.info(tag, 'update-option-list', res);
    return res;
  } catch (e) {
    log.error(tag, 'update-option-list', e);
    throw e;
  }
}
