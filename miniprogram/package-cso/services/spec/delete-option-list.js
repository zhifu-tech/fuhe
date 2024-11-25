import log from '@/common/log/log';
import specStore from '../../stores/spec/index';
import specModel from '../../models/spec/index';

export default async function ({ tag, cId, infoList }) {
  try {
    const res = await specModel.deleteOptionMany({
      tag,
      infoList,
    });

    specStore.deleteSpecOptionList({
      tag,
      cId,
      optionList: infoList.map((it) => it.option),
    });
    log.info(tag, 'delete-option-list', res);
    return res;
  } catch (e) {
    log.error(tag, 'delete-option-list', e);
    throw e;
  }
}
