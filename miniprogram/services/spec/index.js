import cache from './cache';

import list from './list';
import listBatch from './list-batch';

import { create, createMany } from './create';
import { update, updateMany } from './update';
import { deleteSpec, deleteMany } from './delete';

export default {
  addSpecId: '0',
  allSpecId: '1',

  cache,

  create,
  createMany,

  list,
  listBatch,

  update,
  updateMany,

  deleteSpec,
  deleteMany,

  createSpecObject: ({ id, cId, title }) => ({
    _id: id,
    title,
    cId,
    options: [],
  }),
  createSpecOptionObject: ({ id, sId, title }) => ({
    _id: id,
    title,
    sId,
  }),
};
