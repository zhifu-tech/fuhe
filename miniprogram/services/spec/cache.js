import log from '../../common/log/log';

export default (function () {
  const list = new Map();
  const items = new Map();

  return {
    reset: function () {
      list.clear();
      items.clear();
    },
    setList: function (cId, data) {
      list.set(cId, data);
      const { records: specs } = data;
      specs.forEach((spec) => {
        items.set(spec._id, spec);
      });
    },
    getList: function (cId) {
      return list.get(cId);
    },
    getSpec: function (id) {
      return items.get(id);
    },
    setSpec: function (id, spec) {
      items.set(id, spec);
    },
    deleteSpec: function (id) {
      return items.delete(id);
    },
    getSpecOption: function ({ sId, id }) {
      const spec = this.getSpec(sId);
      return spec?.options?.find(({ _id }) => _id === id);
    },
    setSpecOption: function ({ sId, option }) {
      const spec = this.getSpec(sId);
      spec?.options?.push(option);
    },
    deleteSpecOption: function ({ sId, id }) {
      const spec = this.getSpec(sId);
      const index = spec?.options?.findIndex((it) => it._id === id) || -1;
      if (index !== -1) {
        spec.options?.splice(index, 1);
      }
    },
  };
})();
