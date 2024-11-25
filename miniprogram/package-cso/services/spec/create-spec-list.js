import log from '@/common/log/log';
import specStore from '../../stores/spec/index';
import specModel from '../../models/spec/index';

export default async function ({ tag, cId, specList }) {
  try {
    const idList = await specModel.createMany({
      tag,
      paramList: specList.map((it) => ({ cId, title: it.title })),
    });

    // 重新赋值id
    specList.forEach((spec, index) => {
      spec.cId = cId;
      spec._id = idList[index];
    });

    // 保存到store中
    specStore.addSpecList(cId, specList);
    log.info(tag, 'create-spec-list success');
    return specList;
  } catch (e) {
    log.error(tag, 'create-spec-list error', e);
    throw e;
  }
}
