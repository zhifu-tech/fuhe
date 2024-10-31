import list from './list';
import listBatch from './list-batch';

import { create, createMany } from './create';
import { update, updateMany } from './update';
import { deleteSpec, deleteMany } from './delete';

export default {
  addSpecId: '0',
  allSpecId: '1',

  create,
  createMany,

  list,
  listBatch,

  update,
  updateMany,

  deleteSpec,
  deleteMany,
};
