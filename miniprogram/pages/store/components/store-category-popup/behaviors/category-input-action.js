import log from '../../../../../common/log/log';
import services from '../../../../../services/index';
import showToastError from '../../../../../common/toast/simples';

/** 分类的输入行为控制 */
module.exports = Behavior({
  methods: {
    onCategoryInputAction: function (e) {
      const { tag, saasId } = this.data;
      const { value: title, callback } = e.detail;
      // 重复性检查，避免无效的请求
      const cachedCategory = services.category.cache.getCategoryWithTitle({ saasId, title });
      if (cachedCategory) {
        log.info(tag, `${title} duplicated`);
        showToastError({ mesage: `存在{${title}}同名分类` });
        return;
      }
      // 更新UI的展示
      this.setData({
        'category._id': services.category.addCategoryId,
        'category.title': title,
      });
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
