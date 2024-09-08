export default (function () {
  const cache = new Map();
  return {
    reset: function () {
      cache.clear();
    },
    _getOrCreate: function (saasId) {
      let cached = cache.get(saasId);
      if (!cached) {
        cached = {
          list: [],
          items: new Map(),
        };
        cache.set(saasId, cached);
      }
      return cached;
    },
    setList: function ({ saasId, data }) {
      const cached = this._getOrCreate(saasId);
      cached.list.push(data);
      const { records } = data;
      records.forEach((record) => {
        cached.items.set(record._id, record);
      });
    },
    getList: function (saasId, pageNumber) {
      const cached = cache.get(saasId);
      if (cached && pageNumber <= cached.list.length) {
        return cached.list[pageNumber];
      }
      return null;
    },
    setCategory: function (saasId, id, data) {
      const cached = this._getOrCreate(saasId);
      cached.items.set(id, data);
    },
    getCategory: function (saasId, id) {
      return cache.get(saasId)?.items?.get(id);
    },
    deleteCategory: function (saasId, id) {
      return cache.get(saasId)?.items?.delete(id);
    },
    getCategoryWithTitle: function ({ saasId, title }) {
      const values = cache.get(saasId)?.items?.values();
      if (values) {
        for (let val of values) {
          if (val.title === title) {
            return val;
          }
        }
      }
      return null;
    },
  };
})();
