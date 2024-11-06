import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';
import { showToastSuccess, showToastError, showToastLoading } from '@/common/toast/simples';
import { showConfirmDialog } from '@/common/dialog/simples';

/** 删除分类 */
module.exports = Behavior({
  methods: {
    onCategoryIconDeleteClick: function (e) {
      const { tag, category } = this.data;
      showConfirmDialog({
        title: '是否确认删除',
        content: `如果存在与分类「${category.title}」关联的商品，将导致分类不可用！`,
        confirmBtn: '确认删除',
        cancelBtn: '取消',
        confirm: () => {
          log.info(tag, 'category-delete', 'confirm', category);
          this._deleteCategory();
        },
        cancel: (error) => {
          log.info(tag, 'category-delete', 'cancel', error);
          if (error) {
            showToastError({ message: '删除失败！' });
          }
        },
      });
    },
    _deleteCategory: async function () {
      const { tag, category } = this.data;
      // 删除本地未提交分类：重置为新增分类
      if (category._id === stores.category.addCategoryId) {
        this.hide();
      }
      // 删除分类的时候，需要级联删除规格和选项信息。
      else {
        showToastLoading({ message: '删除中...' });
        try {
          await Promise.all([
            // 删除分类
            this.handleCategoryDelete(),
            // 删除所有规格和选项
            this.handleSpecDeleteAll(),
          ]);
          showToastSuccess({ message: '删除成功!' });
        } catch (error) {
          log.error(tag, 'category-delete', 'delete category error', error);
          showToastError({ message: '操作失败，请稍后重试！' });
        }
        // 恢复为新加分类
        this.hide();
      }
    },
  },
});
