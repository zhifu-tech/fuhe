import cache from './cache';

import create from './create';
import get from './get';
import { list, all } from './list';
import update from './update';
import deleteCategory from './delete';

export default {
  addCategoryId: '0', // 新增分类入口
  allCategoryId: '1', // 所有分类入口

  cache,

  create,
  get,
  list,
  all,
  update,
  deleteCategory,

  createCategory: ({ id, saasId, title, disabled }) => ({
    _id: id,
    saasId,
    title,
    disabled,
  }),
};
