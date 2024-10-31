import _create from './create';
import _delete from './delete';
import _update from './update';
import _get from './get';

import storeCategory from '../../stores/category-store';
import log from '@/common/log/log';
import { saasId } from '@/common/saas/saas';

export default (function () {
  return {
    getCategory: async function ({ tag, cId }) {
      const category = storeCategory.getCategory(cId);
      if (category) {
        log.info(tag, 'category-get', 'load from store', category);
        return category;
      }
      try {
        const data = await _get({ tag, _id: cId });
        storeCategory.setCategory(data);
        return data;
      } catch (error) {
        log.error(tag, 'category-get', error);
        throw error;
      }
    },
    getCategoryList: function ({ tag }) {
      const categoryList = storeCategory.categoryList();
      if (categoryList.length > 0) {
        log.info(tag, 'category-list', 'load from store', categoryList);
        return categoryList;
      }
      try {
        return storeCategory.fetchCategoryList({ tag });
      } catch (error) {
        log.error(tag, 'category-list', error);
        throw error;
      }
    },
    createCategory: async function ({ tag, draft }) {
      try {
        const data = await _create({
          saasId: saasId(),
          title: draft.title,
        });
        draft._id = data.id;
        storeCategory.addCategory(draft);
        return draft;
      } catch (error) {
        log.error(tag, 'category-create', error);
        throw error;
      }
    },
    updateCategory: async function ({ tag, category }) {
      try {
        await _update({
          tag,
          _id: category._id,
          title: category.title,
        });
        storeCategory.updateCategory(category);
        return category;
      } catch (error) {
        log.error(tag, 'category-update', error);
        throw error;
      }
    },
    deleteCategory: async function ({ tag, category }) {
      try {
        await _delete({
          tag,
          _id: category._id,
        });
        storeCategory.deleteCategory(category);
        return category;
      } catch (error) {
        log.error(tag, 'category-delete', error);
        throw error;
      }
    },
  };
})();
