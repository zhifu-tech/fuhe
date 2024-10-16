import log from '../../../../../common/log/log';
import services from '../../../../../services/index';

/** 分类共有行为 */
module.exports = Behavior({
  data: {
    category: {},
    categoryInit: {},
    categoryChanged: false,
  },
  observers: {
    'category._id, category.title, category.disabled': function () {
      const changed = this.checkCategorHasChanged();
      console.log('tmp', 'categoryChanged check');
      if (this.data.categoryChanged !== changed) {
        console.log('tmp', 'categoryChanged notify');
        this.setData({
          categoryChanged: changed,
        });
      }
    },
  },
  methods: {
    checkCategorHasChanged: function () {
      const { categoryInit, category } = this.data;
      // 没有设置过id，即没有编辑过，如直接退出
      if (!category._id) return false;
      // 新增分类，编辑过，即需要提交
      if (category._id && !categoryInit._id) return true;
      // 编辑分类，需要比较具体信息
      if (category.title !== categoryInit.title) return true;
      if (category.disabled !== categoryInit.disabled) return true;
      return false;
    },
    /** 处理 catgory 改变的数据 */
    handleCategoryChanged: async function () {
      const { tag, saasId, category } = this.data;
      // 新增分类
      if (category._id === '0') {
        const categoryAdd = await services.category.create({
          tag,
          saasId,
          title: category.title,
        });
        category._id = categoryAdd._id;
        log.info(tag, 'handleCategoryChanged', category);
        this.setHasChanged();
        return categoryAdd;
      }
      // 修改分类
      else {
        const result = await services.category.update({
          tag,
          saasId,
          id: category._id,
          title: category.title,
        });
        log.info(tag, 'updateCategory', result);
        this.setHasChanged();
        return result;
      }
    },
    handleCategoryDelete: async function () {
      const { tag, saasId, category } = this.data;
      await services.category.deleteCategory({
        tag,
        saasId,
        id: category._id,
      });
    },
  },
});
