import log from '../../../../../utils/log';
import services from '../../../../../services/index';

/** 分类的输入行为控制 */
module.exports = Behavior({
  data: {
    categoryActionResponse: {},
  },
  methods: {
    onCategoryInputAction: function (e) {
      const { tag, saasId } = this.data;
      const { value: title } = e.detail || '';
      // 重复性检查，避免无效的请求
      const cachedCategory = services.category.cache.getCategoryWithTitle({ saasId, title });
      if (cachedCategory) {
        log.info(tag, `${title} duplicated`);
        this._notifyCategoryActionResponse({
          result: 'fail',
          reason: `存在{${title}}同名分类`,
        });
        return;
      }
      // 更新UI的展示
      this.setData({
        'category._id': services.category.addCategoryId,
        'category.title': title,
      });
      this.hideCategoryInput();
      // 通知修改之后的状态
      this._notifyCategoryActionResponse({
        result: 'ok',
        post: {
          value: title,
          action: '确认修改',
        },
      });
    },
    _notifyCategoryActionResponse(res) {
      this.setData({
        categoryActionResponse: res,
      });
    },
  },
});
