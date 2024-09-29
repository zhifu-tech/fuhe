import cache from './cache';
import crud from './crud';

export default {
  addCategoryId: '0', // 新增分类入口
  allCategoryId: '1', // 所有分类入口
  addGoodsId: '2', // 新增商品入口

  crud,
  cache,

  createCategory: ({ id, saasId, title, disabled }) => ({
    _id: id,
    saasId,
    title,
    disabled,
  }),
};
