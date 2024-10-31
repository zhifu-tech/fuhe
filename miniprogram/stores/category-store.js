import log from '@/common/log/log';

import { all } from '@/services/category/list';
import { saasId } from '@/common/saas/saas';
import { observable, action, flow } from 'mobx-miniprogram';

export default (function store() {
  const categoryAdd = {
    _id: '0',
    title: '新增分类',
  };
  const categoryAll = {
    _id: '1',
    title: '所有商品',
  };
  return observable({
    //*****************
    // [START] 分类列表
    //*****************
    categoryAdd,
    categoryAll,
    selected: categoryAll._id,
    categoryList: [],

    get categoryExtList() {
      if (this.categoryList.length > 1) {
        return [categoryAll, ...this.categoryList, categoryAdd];
      }
      return [...this.categoryList];
    },

    fetchCategoryListStatus: { code: 'idle' }, // 'loading', 'success', 'error'
    _fetchCategoryListTask: null, // 记录当前正在进行的请求

    fetchCategoryList: action(function ({ tag }) {
      if (this._fetchCategoryListTask) {
        this._fetchCategoryListTask.cancel();
      }
      this.fetchCategoryListStatus = { code: 'loading' };
      this._fetchCategoryListTask = this._fetchCategoryList({ tag });
      return this._fetchCategoryListTask;
    }),
    switchSelectedCategory: action(function (cId) {
      this.selected = cId;
    }),
    _fetchCategoryList: flow(function* ({ tag }) {
      try {
        const { records: categoryList, total } = yield all({
          tag,
          saasId: saasId(),
        });
        this.categoryList = categoryList;
        this.fetchCategoryListStatus = { code: 'success' };

        log.info(tag, '_fetchCategoryList result', categoryList);
      } catch (error) {
        log.error(error);
        this.fetchCategoryListStatus = { code: 'error' };
      }
    }),
    //*****************
    // [END] 分类列表
    //*****************

    //*****************
    // [START] 分类操作
    //*****************
    getCategory: function (cId) {
      return this.categoryList.find(({ _id }) => _id === cId);
    },
    getCategoryWithTitle: function (title) {
      return this.categoryList.find((item) => item.title === title);
    },

    setCategory: action(function (category) {
      const index = this.categoryList.findIndex(({ _id }) => _id === category._id);
      if (index !== -1) {
        this.categoryList[index] = category;
        this.categoryList = this.categoryList.slice();
        log.info('setCategory', category);
      } else {
        this.addCategory(category);
        log.info('addCategory', category);
      }
    }),
    addCategory: action(function (newCategory) {
      this.categoryList.splice(1, 0, newCategory);
      this.categoryList = this.categoryList.slice();
    }),
    updateCategory: action(function (updated) {
      const index = this.categoryList.findIndex(({ _id }) => _id === updated._id);
      if (index !== -1) {
        this.categoryList[index].title = updated.title;
        this.categoryList = this.categoryList.slice();
      }
    }),
    deleteCategory: action(function ({ _id: cId }) {
      const index = this.categoryList.findIndex(({ _id }) => _id === cId);
      if (index !== -1) {
        this.categoryList.splice(index, 1);
        this.categoryList = this.categoryList.slice();
      }
    }),

    //*****************
    // [END] 分类操作
    //*****************
  });
})();
