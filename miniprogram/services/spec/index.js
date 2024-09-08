import cache from './cache';
import crud from './crud';
export default {
  addSpecId: '0',
  allSpecId: '1',

  crud,
  cache,

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
