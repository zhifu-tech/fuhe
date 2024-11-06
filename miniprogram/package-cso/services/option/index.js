import log from '@/common/log/log';
import specStore from '../../stores/spec/index';

import createOptionList from './create-option-list';
import updateOptionList from './update-option-list';
import deleteOptionList from './delete-option-list';

export default {
  createOptionMany: createOptionList,
  updateOptionMany: updateOptionList,
  deleteOptionMany: deleteOptionList,
};
