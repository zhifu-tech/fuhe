const { default: services } = require('../../../../../services/index');
const { default: log } = require('../../../../../utils/log');

module.exports = Behavior({
  data: {
    optionAddedCount: 0,
    optionInputActionResponse: {},
  },
  methods: {
    onOptionInputAction: function (e) {
      const { value: title } = e.detail;
      const { specId: sId } = e.target.dataset;
      const { tag, specs } = this.data;
      log.info(tag, 'option', title, e, specs, spec);
      // 查找绑定的spec
      let spec = specs.find((it) => it._id === sId);
      if (!spec) {
        this._notifySpecOptionActionResponse({
          result: 'fail',
          reason: 'As spec not exits',
        });
        this.showToastError('未知错误');
        log.info(tag, 'option', '未知错误');
        return;
      }
      // 重复性校验
      const dupOption = spec.options?.find((it) => it.title === title);
      if (dupOption) {
        this._notifySpecOptionActionResponse({
          keep: true,
        });
        this.showToastWarning(`已经存在选项 ${title}`);
        return;
      }
      // 校验和clone数据，用来判断是否修改
      spec = this.checkSpecCloned(specs, spec);
      // 本地新增选项
      const id = ++this.data.optionAddedCount;
      spec.options = spec.options || [];
      spec.options.push(
        services.spec.createSpecOptionObject({
          sId: spec._id,
          id: `-${id}`,
          title,
        }),
      );
      log.info(tag, 'option', 'success', spec);
      // 通知UI更新
      this.setData({
        specs,
      });
      // 通知输入反馈
      this._notifySpecOptionActionResponse({
        result: 'ok',
      });
    },
    _notifySpecOptionActionResponse(res) {
      this.setData({
        optionInputActionResponse: res,
      });
    },
  },
});
