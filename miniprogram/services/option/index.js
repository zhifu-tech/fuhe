import spec from '@/stores/spec-store';
import { createMany as _createMany } from './create';
import { update, updateMany } from './update';
import { deleteMany as _deleteMany } from './delete';

export default {
  update,
  updateMany,

  createOptionMany: async function ({ tag, cId, infoList }) {
    const idList = await _createMany({
      tag,
      infoList,
    });
    infoList.forEach(({ option }, index) => {
      option._id = idList[index];
    });
    spec.addSpecOptionList({ cId, optionList: infoList.map((it) => it.option) });
  },
  updateOptionMany: async function ({ tag, cId, infoList }) {
    await updateMany({
      tag,
      infoList,
    });
    spec.updateSpecOptionList({ cId, optionList: infoList.map((it) => it.option) });
  },
  deleteOptionMany: async function ({ tag, cId, specOptionIdList }) {
    await _deleteMany({
      tag,
      _idList: specOptionIdList.map((oId) => oId),
    });
    spec.deleteSpecOptionList(cId, specOptionIdList);
  },
};
