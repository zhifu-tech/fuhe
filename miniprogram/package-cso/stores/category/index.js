import log from '@/common/log/log';
import { observable, action } from 'mobx-miniprogram';

export default (function store() {
  const tagStore = 'goods-store';
  const categoryAdd = {
    _id: '0',
    title: '新增分类',
  };
  const categoryAll = {
    _id: '1',
    title: '所有商品',
  };

  return observable({
    categoryAdd,
    categoryAll,
    selected: categoryAdd._id,
    categoryList: [],
    categoryTotal: 0,

    get categoryExtList() {
      log.info(tagStore, 'categoryExtList', this.categoryList);
      if (this.categoryList.length > 1) {
        return [categoryAll, ...this.categoryList, categoryAdd];
      }
      return [...this.categoryList, categoryAdd];
    },

    fetchCategoryListStatus: {
      code: 'idle', // 'loading', 'success', 'error'
      error: null,
      trigger: '',
    },
    setFetchCategoryListStatus: action(function ({ code, error, trigger }) {
      this.fetchCategoryListStatus = { code, error, trigger };
    }),
    setFetchCategoryListResult: action(function ({ categoryList, total }) {
      this.categoryTotal = total;
      this.categoryList.replace(categoryList);
    }),
    switchSelectedCategory: action(function ({ tag, cId }) {
      log.info(tag, 'switchSelectedCategory', cId);
      this.selected = cId;
    }),

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
        log.info('setCategory', category);
      } else {
        this.addCategory(category);
        log.info('addCategory', category);
      }
    }),
    addCategory: action(function ({ tag, category }) {
      log.info(tag, tagStore, 'addCategory', category);
      this.categoryList.splice(0, 0, category);
    }),
    updateCategory: action(function ({ tag, category: updated }) {
      log.info(tag, tagStore, 'updateCategory', updated.title);
      const category = this.categoryList.find(({ _id }) => _id === updated._id);
      if (!category) {
        log.info(tag, tagStore, 'updateCategory', updated.title, 'not found');
        return;
      }
      // 更新category相关信息
      if (updated.title) category.title = updated.title;
      this.categoryList.replace(this.categoryList);
    }),
    deleteCategory: action(function ({ _id: cId }) {
      const index = this.categoryList.findIndex(({ _id }) => _id === cId);
      if (index !== -1) {
        this.categoryList.splice(index, 1);
      }
      // 如果删除的是当前选中的分类，需要重新选择
      if (this.selected === cId) {
        // 如果还有分类, 则选择第一个分类
        if (this.categoryList.length > 0) {
          this.selected = this.categoryList[0]._id;
        }
        // 否则，选择新增分类
        else {
          this.selected = categoryAdd._id;
        }
      }
    }),
  });
})();
