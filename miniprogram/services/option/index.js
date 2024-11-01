import spec from '@/stores/spec-store';
import { createMany as _createMany } from './create';
import { updateMany as _updateMany } from './update';
import { deleteMany as _deleteMany } from './delete';

export default {
  createOptionMany: async function ({ tag, cId, infoList }) {
    const idList = await _createMany({
      tag,
      infoList,
    });
    infoList.forEach(({ option }, index) => {
      option._id = idList[index];
    });
    spec.addSpecOptionList({
      cId,
      optionList: infoList.map((it) => it.option),
    });
  },
  updateOptionMany: async function ({ tag, cId, infoList }) {
    await _updateMany({
      tag,
      infoList,
    });
    spec.updateSpecOptionList({
      cId,
      optionList: infoList.map((it) => it.option),
    });
  },
  deleteOptionMany: async function ({ tag, cId, infoList }) {
    await _deleteMany({
      tag,
      infoList,
    });
    spec.deleteSpecOptionList({
      cId,
      optionList: infoList.map((it) => it.option),
    });
  },
};
