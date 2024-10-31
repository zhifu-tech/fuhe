import log from '@/common/log/log';
import { saasId } from '@/common/saas/saas';
import services from '@/services/index';
import store from '@/stores/store';

/** 分类共有行为 */
module.exports = Behavior({
  data: {
    categoryChanged: false,
  },
  observers: {
    'category._id, category.title, category.disabled': function () {
      const changed = this.checkCategorHasChanged();
      if (this.data.categoryChanged !== changed) {
        this.setData({
          categoryChanged: changed,
        });
      }
    },
  },
  methods: {
    checkCategorHasChanged: function () {
      const { _category, category } = this.data;
      // 没有设置过id，即没有编辑过，如直接退出
      if (!category._id) return false;
      // 新增分类，编辑过，即需要提交
      if (category._id && !_category._id) return true;
      // 编辑分类，需要比较具体信息
      if (category.title !== _category.title) return true;
      if (category.disabled !== _category.disabled) return true;
      return false;
    },
    /** 处理 catgory 改变的数据 */
    handleCategoryChanged: async function () {
      const { tag, category } = this.data;
      if (category._id === store.category.categoryAdd._id) {
        await services.category.createCategory({
          tag,
          draft: category,
        });
        return category;
      } else {
        await services.category.updateCategory({
          tag,
          category,
        });
        return category;
      }
    },
    handleCategoryDelete: async function () {
      const { tag, category } = this.data;
      await services.category.deleteCategory({
        tag,
        category,
      });
      return category;
    },
  },
});
