import Dialog from 'tdesign-miniprogram/dialog/index';
import pages from '../../../../../common/page/pages';
const { default: log } = require('../../../../../common/log/log');

/** 删除分类 */
module.exports = Behavior({
  methods: {
    onCategoryIconDeleteClick: function (e) {
      const { tag, category } = this.data;
      Dialog.confirm({
        context: pages.currentPage().store(),
        title: '是否确认删除',
        content: `如果存在与分类「${category.title}」关联的作品，将导致分类不可用！`,
        confirmBtn: '确认删除',
        cancelBtn: '取消',
        zIndex: pages.zIndexDialog,
        overlayProps: {
          zIndex: pages.zIndexDialogOverlay,
        },
      })
        .then(() => this._deleteCategory())
        .catch((error) => {
          log.info(tag, 'category-delte', 'cancel', error);
          if (error) {
            this.showToastError('删除失败！');
          }
        });
    },
    _deleteCategory: async function () {
      log.info(tag, 'category-delte', this);
      const { tag, category } = this.data;
      // 删除本地未提交分类：重置为新增分类
      if (category._id === '0') {
        this.hide();
      }
      // 删除分类的时候，需要级联删除规格和选项信息。
      else {
        this.setHasChanged();
        this.showToastLoading('删除中...');
        await Promise.all([
          // 删除分类
          this.handleCategoryDelete(),
          // 删除所有规格和选项
          this.handleSpecDeleteAll(),
        ]);
        this.showToastSuccess('删除成功！');
        // 恢复为新加分类
        this.hide();
      }
    },
  },
});
