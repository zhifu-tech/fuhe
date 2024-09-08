import services from '../../../../../services/index';
import log from '../../../../../utils/log';
module.exports = Behavior({
  data: {
    specsAddedCount: 0,
    specActionResponse: {},
  },
  methods: {
    onSpecInputAction: function (e) {
      const { value: title } = e.detail;
      const { specId } = e.target.dataset;
      const { tag, category, specs } = this.data;
      const dupSpec = specs.find((it) => it.title === title);
      if (dupSpec) {
        this._notifySpecActionResponse({
          keep: true,
        });
        this.showToastWarning(`已经存在规格 ${title}`);
        return;
      }
      // 有附加spec为编辑信息；否则为新增信息
      let spec = specs.find((it) => it._id === specId);
      if (spec) {
        // 数据修改之前，需要进行拷贝处理
        spec = this.checkSpecCloned(specs, spec);
        spec.title = title;
        log.info(tag, 'onEditSpecEvent', title, spec);
      } else {
        this.data.specsAddedCount++;
        specs.push(
          services.spec.createSpecObject({
            id: `-${this.data.specsAddedCount}`,
            cId: category._id,
            title,
          }),
        );
        log.info(tag, 'onAddSpecEvent', title, specs);
      }
      this.setData({
        specs,
      });
      this._notifySpecActionResponse({
        result: 'ok',
      });
    },
    _notifySpecActionResponse(res) {
      this.setData({
        specActionResponse: res,
      });
    },
  },
});
