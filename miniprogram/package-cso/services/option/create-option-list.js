import log from '@/common/log/log';
import specStore from '../../stores/spec/index';
import specModel from '../../models/spec/index';

export default async function ({ tag, cId, infoList }) {
  try {
    const idList = await specModel.createMany({
      tag,
      infoList,
    });
    // 更新参数的id
    infoList.forEach(({ option }, index) => {
      option._id = idList[index];
    });

    // 保存结果到store中
    specStore.addSpecOptionList({
      tag,
      cId,
      optionList: infoList.map((it) => it.option),
    });
    log.info(tag, 'create-option-list');
  } catch (error) {
    log.error(tag, 'create-option-list', error);
  }
}
