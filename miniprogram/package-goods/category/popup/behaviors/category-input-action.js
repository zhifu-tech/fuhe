import log from '@/common/log/log';
import stores from '@/stores/index';
import { showToastError } from '@/common/toast/simples';

/** 分类的输入行为控制 */
module.exports = Behavior({
  methods: {
    onCategoryInputAction: function (e) {
      const { tag, category } = this.data;
      const { value: title, callback } = e.detail;
      // 重复性检查，避免无效的请求
      const cachedCategory = stores.category.getCategoryWithTitle(title);
      if (cachedCategory) {
        log.info(tag, `${title} duplicated`);
        showToastError({ message: `已有{${title}}` });
        return;
      }
      // 更新UI的展示
      const notifyData = {
        'category.title': title,
      };
      if (!category._id) {
        category._id = stores.category.categoryAdd._id;
      }
      this.setData(notifyData);
      // 通知修改之后的状态
      callback({
        value: title,
        action: '确认修改',
        actionDisabled: true,
      });
      this.hideCategoryInput();
    },
  },
});
