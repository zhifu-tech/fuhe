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
    _selected: categoryAdd._id,
    categoryList: [],
    categoryTotal: 0,

    get categoryExtList() {
      if (this.categoryList.length > 1) {
        return [categoryAll, ...this.categoryList, categoryAdd];
      }
      return [...this.categoryList, categoryAdd];
    },

    setCategoryList: action(function ({ categoryList, total }) {
      this.categoryTotal = total;
      this.categoryList.replace(categoryList);
    }),

    set selected(cId) {
      this._selected = cId;
    },
    get selected() {
      log.info(tagStore, 'categorySelected', this._selected);
      // 如果当前选中的 `_selected` 与 `categoryAdd._id` 不同，
      // 并且 `_selected` 存在于 `categoryExtList` 中，则直接返回 `_selected`
      if (this._selected !== this.categoryAdd._id) {
        const found = this.categoryExtList.some(({ _id }) => _id === this._selected);
        if (found) return this._selected;
      }
      // 如果不满足以上条件，或者 `_selected` 不在 `categoryExtList` 中，
      // 则重置为 `categoryExtList[0]._id`
      this._selected = this.categoryExtList[0]?._id || null;
      return this._selected;
    },

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
    }),
  });
})();
