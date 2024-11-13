import { observable, action } from 'mobx-miniprogram';

export default (function store() {
  const tagStore = 'entity-store';

  return observable({
    entityList: null,

    setEntityList: action(function ({ tag, entityList }) {
      this.entityList = entityList;
    }),

    getEntity: function (id) {
      return this.entityList.find(({ _id }) => _id === id);
    },
  });
})();
