import services from '../../../../../services/index';
import log from '../../../../../common/log/log';
module.exports = Behavior({
  data: {
    scrollIntoView: '',
    specsAddedCount: 0,
    specActionResponse: {},
  },
  methods: {
    onSpecInputAction: function (e) {
      const { value: title, callback } = e.detail;
      const { specId } = e.target.dataset;
      const { tag, category, specs } = this.data;
      const dupSpec = specs.find((it) => it.title === title);
      if (dupSpec) {
        this.showToastError(`已经存在规格 ${title}`);
        log.info(tag, 'spec', `已经存在规格 ${title}`);
        return;
      }
      // 有附加spec为编辑信息；否则为新增信息
      let spec = specs.find((it) => it._id === specId);
      if (spec) {
        // 数据修改之前，需要进行拷贝处理
        spec = this.checkSpecEditable(specs, spec);
        spec.title = title;
        this.setData({
          specs,
        });
        // 编辑完成之后，关闭编辑输入
        callback({
          value: '',
        });
        this.hideSpecEdit();
        log.info(tag, 'onEditSpecEvent', title, spec);
      } else {
        this.data.specsAddedCount++;
        const added = services.spec.createSpecObject({
          id: `-${this.data.specsAddedCount}`,
          cId: category._id,
          title,
        });
        added.editable = true;
        specs.push(added);
        this.setData({
          specs,
          // 需要定位到新增加的规格
          scrollIntoView: 'id-' + added._id,
        });
        // 新加规格，需要展开选项输入
        this.showOptionAdd(added._id);
        // 清空输入
        callback({
          value: '',
        });
        log.info(tag, 'onAddSpecEvent', title, added);
      }
    },
  },
});
