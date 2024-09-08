import cache from './cache';
import crud from './crud';

export default {
  addCategoryId: '0',
  allCategoryId: '1',

  crud,
  cache,

  createCategory: ({ id, saasId, title, disabled }) => ({
    _id: id,
    saasId,
    title,
    disabled,
  }),
};
